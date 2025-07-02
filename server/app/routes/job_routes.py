from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.job_controller import (
    get_all_jobs,
    get_job_by_id,
    create_job,
    delete_job,
    get_jobs_by_employer_id
)
from app.models import User, RoleEnum, Notification, Application, Job
from app.database import db

job_bp = Blueprint("jobs", __name__, url_prefix="/jobs")

# Get all jobs
@job_bp.route("/", methods=["GET"])
def list_jobs():
    jobs = get_all_jobs()
    return jsonify({"jobs": [job.to_dict() for job in jobs]}), 200

# Get job by ID
@job_bp.route("/<int:job_id>", methods=["GET"])
def get_job(job_id):
    job = get_job_by_id(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job.to_dict()), 200

# Post a job (Employers only)
@job_bp.route("/", methods=["POST"])
@jwt_required()
def post_job():
    current_user = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get("title") or not data.get("description"):
        return jsonify({"error": "Missing required job fields"}), 400

    try:
        employer_id = int(current_user)
    except Exception:
        return jsonify({"error": "Invalid employer id"}), 400

    employer = User.query.filter_by(id=employer_id).first()
    if not employer:
        return jsonify({"error": "Employer user does not exist"}), 400
    if employer.role != RoleEnum.employer:
        return jsonify({"error": "Only users with employer role can post jobs"}), 403

    job_data = {
        "title": data["title"],
        "job_description": data["description"],
        "location": data.get("location", ""),
        "type": data.get("type", "")
    }

    try:
        job = create_job(job_data, employer_id=employer_id)
        return jsonify({"job": job.to_dict()}), 201
    except Exception as e:
        import traceback
        print("ERROR in /jobs/ POST route:", str(e))
        traceback.print_exc()
        return jsonify({"error": f"Failed to create job: {str(e)}"}), 422

# List jobs by employer
@job_bp.route("/employer/<int:employer_id>", methods=["GET"])
@jwt_required()
def list_jobs_by_employer(employer_id):
    jobs = get_jobs_by_employer_id(employer_id)
    return jsonify({"jobs": [job.to_dict() for job in jobs]}), 200

# Admin: List jobs by employer
@job_bp.route("/admin/employer/<int:employer_id>/jobs", methods=["GET"])
@jwt_required()
def admin_list_jobs_by_employer(employer_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()
    if not user or user.role != RoleEnum.admin:
        return jsonify({"error": "Unauthorized"}), 403
    jobs = get_jobs_by_employer_id(employer_id)
    return jsonify({"jobs": [job.to_dict() for job in jobs]}), 200

# Delete a job
@job_bp.route("/<int:job_id>", methods=["DELETE"])
@jwt_required()
def remove_job(job_id):
    current_user = get_jwt_identity()
    try:
        employer_id = int(current_user)
    except Exception:
        return jsonify({"error": "Invalid employer id"}), 400

    success = delete_job(job_id, employer_id=employer_id)
    if not success:
        return jsonify({"error": "Job not found or not authorized"}), 404
    return jsonify({"message": "Job deleted"}), 200

# Update job details
@job_bp.route("/<int:job_id>", methods=["PUT"])
@jwt_required()
def update_job(job_id):
    current_user = get_jwt_identity()
    try:
        employer_id = int(current_user)
    except Exception:
        return jsonify({"error": "Invalid employer id"}), 400

    job = Job.query.filter_by(id=job_id, employer_id=employer_id).first()
    if not job:
        return jsonify({"error": "Job not found or not authorized"}), 404

    data = request.get_json()
    if "title" in data:
        job.title = data["title"]
    if "description" in data:
        job.job_description = data["description"]
    if "location" in data:
        job.location = data["location"]
    if "type" in data:
        job.type = data["type"]

    db.session.commit()
    return jsonify({"job": job.to_dict()}), 200

# Get notifications for employer
@job_bp.route("/notifications", methods=["GET"])
@jwt_required()
def get_notifications():
    current_user = get_jwt_identity()
    employer_id = int(current_user)
    notifs = Notification.query.filter_by(employer_id=employer_id).order_by(Notification.created_at.desc()).all()

    notifications_with_applicant = []
    for n in notifs:
        applicant_name = None
        if n.application_id:
            app = Application.query.filter_by(id=n.application_id).first()
            if app:
                user = User.query.filter_by(id=app.user_id).first()
                if user:
                    applicant_name = user.full_name
        notifications_with_applicant.append({
            **n.to_dict(),
            "applicant_name": applicant_name
        })

    return jsonify(notifications_with_applicant), 200

# Get applicants for a specific job
@job_bp.route("/<int:job_id>/applicants", methods=["GET"])
@jwt_required()
def get_applicants_for_job(job_id):
    apps = Application.query.filter_by(job_id=job_id).all()
    result = []
    for app in apps:
        user = User.query.filter_by(id=app.user_id).first()
        if user:
            result.append({
                "application_id": app.id,
                "user_id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role.value,
                "bio": user.bio,
                "skills": user.skills,
                "resume_url": user.resume_url,
                "status": app.status,
                "applied_at": app.created_at.isoformat() if app.created_at else None
            })
    return jsonify(result), 200

# Update an applicant's profile (admin or employer)
@job_bp.route("/applicants/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_applicant_profile(user_id):
    data = request.get_json()
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.full_name = data.get("full_name", user.full_name)
    user.bio = data.get("bio", user.bio)
    user.skills = data.get("skills", user.skills)
    user.resume_url = data.get("resume_url", user.resume_url)

    if "role" in data and data["role"] in [r.value for r in RoleEnum]:
        user.role = RoleEnum(data["role"])

    db.session.commit()
    return jsonify({"message": "Applicant profile updated", "user": user.to_dict()}), 200

# Update employer profile (add company_name support)
@job_bp.route("/employer/<int:employer_id>/profile", methods=["PUT"])
@jwt_required()
def update_employer_profile(employer_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()
    if not user or (user.role != RoleEnum.admin and user.id != employer_id):
        return jsonify({"error": "Unauthorized"}), 403

    employer = User.query.filter_by(id=employer_id, role=RoleEnum.employer).first()
    if not employer:
        return jsonify({"error": "Employer not found"}), 404

    data = request.get_json()
    employer.full_name = data.get("full_name", employer.full_name)
    employer.bio = data.get("bio", employer.bio)
    employer.skills = data.get("skills", employer.skills)
    employer.resume_url = data.get("resume_url", employer.resume_url)
    employer.company_name = data.get("company_name", employer.company_name)

    db.session.commit()
    return jsonify({"message": "Employer profile updated", "user": employer.to_dict()}), 200

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.job_controller import (
    get_all_jobs,
    get_job_by_id,
    create_job,
    delete_job,
    get_jobs_by_employer_id
)

job_bp = Blueprint("jobs", __name__, url_prefix="/jobs")

@job_bp.route("/", methods=["GET"])
def list_jobs():
    jobs = get_all_jobs()
    return jsonify({"jobs": [job.to_dict() for job in jobs]}), 200

@job_bp.route("/<int:job_id>", methods=["GET"])
def get_job(job_id):
    job = get_job_by_id(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job.to_dict()), 200

@job_bp.route("/", methods=["POST"])
@jwt_required()
def post_job():
    current_user = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get("title") or not data.get("description"):
        return jsonify({"error": "Missing required job fields"}), 400

    job = create_job(data, employer_id=current_user)
    return jsonify({"job": job.to_dict()}), 201

@job_bp.route("/employer/<int:employer_id>", methods=["GET"])
@jwt_required()
def list_jobs_by_employer(employer_id):
    jobs = get_jobs_by_employer_id(employer_id)
    return jsonify({"jobs": [job.to_dict() for job in jobs]}), 200

@job_bp.route("/<int:job_id>", methods=["DELETE"])
@jwt_required()
def remove_job(job_id):
    current_user = get_jwt_identity()
    success = delete_job(job_id, employer_id=current_user)
    if not success:
        return jsonify({"error": "Job not found or not authorized"}), 404
    return jsonify({"message": "Job deleted"}), 200

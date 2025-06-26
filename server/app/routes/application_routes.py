from flask import Blueprint, request, jsonify
from app.controllers.application_controller import (
    apply_to_job,
    get_applications_by_user,
    get_applications_by_job,
    update_application_status,
    delete_application,
)
from flask_jwt_extended import jwt_required, get_jwt_identity

application_bp = Blueprint("applications", __name__, url_prefix="/applications")

@application_bp.route("/apply", methods=["POST"])
@jwt_required()
def apply():
    data = request.get_json()
    user_id = get_jwt_identity()
    job_id = data.get("job_id")

    if not job_id:
        return jsonify({"error": "Job ID is required"}), 400

    application = apply_to_job(user_id, job_id)
    if application is None:
        return jsonify({"error": "Already applied or application failed"}), 400

    return jsonify({"message": "Applied successfully"}), 201

@application_bp.route("/user/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user_apps(user_id):
    apps = get_applications_by_user(user_id)
    return jsonify([{
        "id": a.id,
        "job_id": a.job_id,
        "status": a.status,
        "created_at": a.created_at
    } for a in apps]), 200

@application_bp.route("/job/<int:job_id>", methods=["GET"])
@jwt_required()
def get_job_apps(job_id):
    apps = get_applications_by_job(job_id)
    return jsonify([{
        "id": a.id,
        "user_id": a.user_id,
        "status": a.status,
        "created_at": a.created_at
    } for a in apps]), 200

@application_bp.route("/<int:application_id>/status", methods=["PUT"])
@jwt_required()
def update_status(application_id):
    data = request.get_json()
    new_status = data.get("status")
    if not new_status:
        return jsonify({"error": "Status required"}), 400

    app = update_application_status(application_id, new_status)
    if not app:
        return jsonify({"error": "Application not found"}), 404
    return jsonify({"message": "Status updated"}), 200

@application_bp.route("/<int:application_id>", methods=["DELETE"])
@jwt_required()
def delete_app(application_id):
    success = delete_application(application_id)
    if not success:
        return jsonify({"error": "Application not found"}), 404
    return jsonify({"message": "Application deleted"}), 200

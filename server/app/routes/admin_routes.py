from flask import Blueprint, jsonify, request
from app.controllers.user_controller import get_all_users, get_user_by_id, delete_user
from app.controllers.job_controller import get_all_jobs, delete_job

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

# Get all users
@admin_bp.route("/users", methods=["GET"])
def list_users():
    users = get_all_users()
    return jsonify(users), 200

# Get single user by ID
@admin_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user), 200

# Delete user by ID
@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
def remove_user(user_id):
    if delete_user(user_id):
        return jsonify({"message": "User deleted"}), 200
    return jsonify({"error": "User not found or could not be deleted"}), 400

# List all jobs
@admin_bp.route("/jobs", methods=["GET"])
def list_all_jobs():
    jobs = get_all_jobs()
    return jsonify(jobs), 200

# Delete job by ID
@admin_bp.route("/jobs/<int:job_id>", methods=["DELETE"])
def remove_job_by_admin(job_id):
    if delete_job(job_id):
        return jsonify({"message": "Job deleted"}), 200
    return jsonify({"error": "Job not found or not allowed"}), 404

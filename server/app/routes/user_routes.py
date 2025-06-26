from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.controllers.user_controller import (
    get_all_users,
    get_user_by_id,
    delete_user
)

from app.models import User
from app.database import db_session

user_bp = Blueprint("users", __name__, url_prefix="/users")

@user_bp.route("/", methods=["GET"])
def list_users():
    users = get_all_users()
    return jsonify(users), 200

@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user), 200

@user_bp.route("/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    user = db_session.query(User).get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()

    user.full_name = data.get("full_name", user.full_name)
    user.bio = data.get("bio", user.bio)
    user.skills = data.get("skills", user.skills)
    user.resume_url = data.get("resume_url", user.resume_url)

    db_session.commit()

    return jsonify({"message": "User updated successfully", "user": user.to_dict()}), 200

@user_bp.route("/<int:user_id>", methods=["DELETE"])
def remove_user(user_id):
    success = delete_user(user_id)
    if not success:
        return jsonify({"error": "User not found or could not be deleted"}), 400
    return jsonify({"message": "User deleted"}), 200

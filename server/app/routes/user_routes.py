from flask import Blueprint, request, jsonify
from app.models import User, RoleEnum
from app.database import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

user_bp = Blueprint("users", __name__, url_prefix="/users")

# Register user
@user_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "seeker")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    try:
        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            role=RoleEnum(role)
        )
        db.session.add(user)
        db.session.commit()

        token = create_access_token(identity=user.id)
        return jsonify({"token": token, "user": user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Login user
@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    try:
        token = create_access_token(identity=user.id)
        return jsonify({"token": token, "user": user.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# List all users
@user_bp.route("/", methods=["GET"])
def list_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

# Get single user
@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200

# Update user info
@user_bp.route("/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    user.full_name = data.get("full_name", user.full_name)
    user.bio = data.get("bio", user.bio)
    user.skills = data.get("skills", user.skills)
    user.resume_url = data.get("resume_url", user.resume_url)

    db.session.commit()
    return jsonify({"message": "User updated successfully", "user": user.to_dict()}), 200

# Delete user
@user_bp.route("/<int:user_id>", methods=["DELETE"])
def remove_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found or could not be deleted"}), 400
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

# List all employers (Admin only)
@user_bp.route("/employers", methods=["GET"])
@jwt_required()
def list_employers():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    if not user or user.role != RoleEnum.admin:
        return jsonify({"error": "Unauthorized"}), 403

    employers = User.query.filter_by(role=RoleEnum.employer).all()
    return jsonify([e.to_dict() for e in employers]), 200

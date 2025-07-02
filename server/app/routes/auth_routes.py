from flask import Blueprint, request, jsonify
from app.database import db  # ✅ Use Flask-SQLAlchemy db
from app.models import User, RoleEnum
from app.utils.auth_utils import hash_password, check_password
from app.utils.jwt_handler import generate_token

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not all([full_name, email, password, role]):
        return jsonify({"error": "Missing required fields"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "User with that email already exists"}), 409

    try:
        user_role = RoleEnum(role.lower())
    except ValueError:
        return jsonify({"error": "Invalid role"}), 400

    new_user = User(
        full_name=full_name,
        email=email,
        password_hash=hash_password(password),
        role=user_role
    )

    db.session.add(new_user)
    db.session.commit()

    token = generate_token(new_user.id, new_user.role.value)
    return jsonify({
        "message": "User registered successfully",
        "token": token,
        "user": {
            "id": new_user.id,
            "full_name": new_user.full_name,
            "email": new_user.email,
            "role": new_user.role.value
        }
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"error": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password(password, user.password_hash):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(user.id, user.role.value)
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role.value
        }
    }), 200

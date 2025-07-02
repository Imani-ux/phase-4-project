from app.models import User
from app.database import db
from sqlalchemy.exc import SQLAlchemyError


def get_all_users():
    try:
        users = User.query.all()
        return [user_to_dict(user) for user in users]
    except SQLAlchemyError as e:
        print("Error fetching users:", e)
        return []


def get_user_by_id(user_id):
    try:
        user = User.query.filter_by(id=user_id).one_or_none()
        return user_to_dict(user) if user else None
    except SQLAlchemyError as e:
        print("Error fetching user:", e)
        return None


def delete_user(user_id):
    try:
        user = User.query.filter_by(id=user_id).one_or_none()
        if not user:
            return False
        db.session.delete(user)
        db.session.commit()
        return True
    except SQLAlchemyError as e:
        db.session.rollback()
        print("Error deleting user:", e)
        return False


def update_user_status(user_id, new_status):
    try:
        user = User.query.filter_by(id=user_id).one_or_none()
        if not user:
            return False
        user.status = new_status
        db.session.commit()
        return True
    except SQLAlchemyError as e:
        db.session.rollback()
        print("Error updating status:", e)
        return False


def user_to_dict(user):
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role.value if hasattr(user.role, "value") else user.role,
        "status": user.status
    }

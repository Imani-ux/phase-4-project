from app.models import Review
from app.database import db_session
from sqlalchemy.exc import SQLAlchemyError


def create_review(data):
    try:
        review = Review(
            rating=data["rating"],
            comment=data.get("comment", ""),
            reviewer_id=data["reviewer_id"],
            reviewed_id=data["reviewed_id"]
        )
        db_session.add(review)
        db_session.commit()
        return review
    except SQLAlchemyError as e:
        db_session.rollback()
        print("Error creating review:", e)
        return None


def get_reviews_for_user(user_id):
    try:
        reviews = db_session.query(Review).filter_by(reviewed_id=user_id).all()
        return [review.to_dict() for review in reviews]
    except SQLAlchemyError as e:
        print("Error fetching reviews:", e)
        return []

from app.models import Review
from app.database import db
from sqlalchemy.exc import SQLAlchemyError


def create_review(data):
    try:
        review = Review(
            rating=data["rating"],
            comment=data.get("comment", ""),
            reviewer_id=data["reviewer_id"],
            reviewed_id=data["reviewed_id"]
        )
        db.session.add(review)
        db.session.commit()
        return review
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"❌ Error creating review: {e}")
        return None


def get_reviews_for_user(user_id):
    try:
        reviews = Review.query.filter_by(reviewed_id=user_id).all()
        return [review.to_dict() for review in reviews]
    except SQLAlchemyError as e:
        print(f"❌ Error fetching reviews: {e}")
        return []

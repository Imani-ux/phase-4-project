from flask import Blueprint, request, jsonify
from app.controllers.review_controller import create_review, get_reviews_for_user

review_bp = Blueprint("reviews", __name__, url_prefix="/reviews")

@review_bp.route("/", methods=["POST"])
def post_review():
    data = request.get_json()
    required_fields = ["rating", "reviewer_id", "reviewed_id"]

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    review = create_review(data)
    if not review:
        return jsonify({"error": "Could not create review"}), 500

    return jsonify(review.to_dict()), 201

@review_bp.route("/<int:user_id>", methods=["GET"])
def get_reviews(user_id):
    reviews = get_reviews_for_user(user_id)
    return jsonify(reviews), 200

from flask import Blueprint, request, jsonify
from app.controllers.message_controller import send_message, get_conversation

message_bp = Blueprint("messages", __name__, url_prefix="/messages")

#TEVIN
@message_bp.route("/send", methods=["POST"])
def send():
    data = request.get_json()
    sender_id = data.get("sender_id")
    receiver_id = data.get("receiver_id")
    content = data.get("content")

    if not sender_id or not receiver_id or not content:
        return jsonify({"error": "Missing required fields"}), 400

    message = send_message(sender_id, receiver_id, content)
    if not message:
        return jsonify({"error": "Message could not be sent"}), 500

    return jsonify({
        "id": message.id,
        "sender_id": message.sender_id,
        "receiver_id": message.receiver_id,
        "content": message.content,
        "timestamp": message.timestamp
    }), 201


@message_bp.route("/conversation", methods=["GET"])
def conversation():
    user1 = request.args.get("user1_id")
    user2 = request.args.get("user2_id")

    if not user1 or not user2:
        return jsonify({"error": "Missing user IDs"}), 400

    messages = get_conversation(int(user1), int(user2))
    return jsonify([
        {
            "id": m.id,
            "sender_id": m.sender_id,
            "receiver_id": m.receiver_id,
            "content": m.content,
            "timestamp": m.timestamp
        } for m in messages
    ])

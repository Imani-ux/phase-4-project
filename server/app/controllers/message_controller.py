from app.models import Message
from app.database import db_session
from sqlalchemy.exc import SQLAlchemyError


def send_message(sender_id, receiver_id, content):
    try:
        message = Message(sender_id=sender_id, receiver_id=receiver_id, content=content)
        db_session.add(message)
        db_session.commit()
        return message
    except SQLAlchemyError as e:
        db_session.rollback()
        print("Error sending message:", e)
        return None


def get_conversation(user1_id, user2_id):
    try:
        messages = (
            db_session.query(Message)
            .filter(
                ((Message.sender_id == user1_id) & (Message.receiver_id == user2_id)) |
                ((Message.sender_id == user2_id) & (Message.receiver_id == user1_id))
            )
            .order_by(Message.timestamp)
            .all()
        )
        return messages
    except SQLAlchemyError as e:
        print("Error fetching conversation:", e)
        return []

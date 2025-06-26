from sqlalchemy import Column, Integer, String, ForeignKey, Text, Enum, DateTime, func
from sqlalchemy.orm import relationship, declarative_base
import enum

Base = declarative_base()

# --- ENUM for roles ---
class RoleEnum(enum.Enum):
    seeker = "seeker"
    employer = "employer"
    admin = "admin"

# --- User Model ---
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)

    # Optional profile fields
    bio = Column(Text)
    skills = Column(Text)
    resume_url = Column(String(255))

    # Relationships
    jobs = relationship("Job", back_populates="employer", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")

    sent_messages = relationship("Message", foreign_keys="[Message.sender_id]", back_populates="sender", cascade="all, delete-orphan")
    received_messages = relationship("Message", foreign_keys="[Message.receiver_id]", back_populates="receiver", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.email} ({self.role})>"

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role.value,
            "bio": self.bio,
            "skills": self.skills,
            "resume_url": self.resume_url
        }

# --- Job Model ---
class Job(Base):
    __tablename__ = 'jobs'

    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    job_description = Column(Text, nullable=False)
    location = Column(String(100))
    type = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    employer_id = Column(Integer, ForeignKey("users.id"))
    employer = relationship("User", back_populates="jobs")

    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Job {self.title} at {self.location}>"

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.job_description,
            "location": self.location,
            "type": self.type,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "employer_id": self.employer_id
        }

# --- Application Model ---
class Application(Base):
    __tablename__ = 'applications'

    id = Column(Integer, primary_key=True)
    status = Column(String(50), default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))

    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")

    def __repr__(self):
        return f"<Application User:{self.user_id} Job:{self.job_id} Status:{self.status}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "job_id": self.job_id,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

# --- Message Model ---
class Message(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")

    def __repr__(self):
        return f"<Message from {self.sender_id} to {self.receiver_id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "content": self.content,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }

# --- Review Model ---
class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reviewed_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    reviewer = relationship("User", foreign_keys=[reviewer_id])
    reviewed = relationship("User", foreign_keys=[reviewed_id])

    def __repr__(self):
        return f"<Review {self.reviewer_id} → {self.reviewed_id} ⭐{self.rating}>"

    def to_dict(self):
        return {
            "id": self.id,
            "rating": self.rating,
            "comment": self.comment,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "reviewer_id": self.reviewer_id,
            "reviewed_id": self.reviewed_id,
        }

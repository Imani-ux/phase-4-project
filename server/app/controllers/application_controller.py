from app.database import db_session
from app.models import Application, Job, Notification, User
from datetime import datetime

def apply_to_job(user_id, job_id):
    # Prevent duplicate applications
    existing = db_session.query(Application).filter_by(user_id=user_id, job_id=job_id).first()
    if existing:
        return None

    application = Application(
        user_id=user_id,
        job_id=job_id,
        status="pending",
        created_at=datetime.utcnow()
    )
    db_session.add(application)
    db_session.flush()  # Get application.id before commit

    # Create notification for employer with applicant name and application id
    job = db_session.query(Job).filter_by(id=job_id).first()
    user = db_session.query(User).filter_by(id=user_id).first()
    if job and user:
        notif = Notification(
            employer_id=job.employer_id,
            message=f"New applicant {user.full_name} for your job '{job.title}'",
            application_id=application.id  # You may need to add this column to Notification model
        )
        db_session.add(notif)

    db_session.commit()
    return application

def get_applications_by_user(user_id):
    return db_session.query(Application).filter_by(user_id=user_id).all()

def get_applications_by_job(job_id):
    return db_session.query(Application).filter_by(job_id=job_id).all()

def update_application_status(application_id, new_status):
    app = db_session.query(Application).filter_by(id=application_id).first()
    if not app:
        return None

    app.status = new_status
    db_session.commit()
    return app

def delete_application(application_id):
    app = db_session.query(Application).filter_by(id=application_id).first()
    if not app:
        return False

    db_session.delete(app)
    db_session.commit()
    return True

from app.database import db_session
from app.models import Application
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

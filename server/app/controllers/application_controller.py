from app.database import db
from app.models import Application, Job, Notification, User
from datetime import datetime

def apply_to_job(user_id, job_id):
    # Prevent duplicate applications
    existing = Application.query.filter_by(user_id=user_id, job_id=job_id).first()
    if existing:
        return None

    application = Application(
        user_id=user_id,
        job_id=job_id,
        status="pending",
        created_at=datetime.utcnow()
    )
    db.session.add(application)
    db.session.flush()  # Get application.id before commit

    # Create notification for employer with applicant name
    job = Job.query.get(job_id)
    user = User.query.get(user_id)
    if job and user:
        notif = Notification(
            employer_id=job.employer_id,
            message=f"New applicant {user.full_name} for your job '{job.title}'",
            application_id=application.id
        )
        db.session.add(notif)

    db.session.commit()
    return application

def get_applications_by_user(user_id):
    return Application.query.filter_by(user_id=user_id).all()

def get_applications_by_job(job_id):
    return Application.query.filter_by(job_id=job_id).all()

def update_application_status(application_id, new_status):
    app = Application.query.get(application_id)
    if not app:
        return None

    app.status = new_status
    db.session.commit()
    return app

def delete_application(application_id):
    app = Application.query.get(application_id)
    if not app:
        return False

    db.session.delete(app)
    db.session.commit()
    return True

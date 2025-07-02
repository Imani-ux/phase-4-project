from app.models import Job
from app.database import db
from sqlalchemy.exc import SQLAlchemyError

def get_all_jobs():
    return Job.query.all()

def get_job_by_id(job_id):
    return Job.query.get(job_id)

def create_job(data, employer_id):
    try:
        print("DEBUG: Creating job with data:", data, "employer_id:", employer_id)
        job = Job(
            title=data["title"],
            job_description=data["job_description"],
            location=data.get("location", ""),
            type=data.get("type", ""),
            employer_id=employer_id
        )
        db.session.add(job)
        db.session.commit()
        return job
    except SQLAlchemyError as e:
        db.session.rollback()
        print("ERROR in create_job:", str(e))
        raise

def get_jobs_by_employer_id(employer_id):
    return Job.query.filter_by(employer_id=employer_id).all()

def delete_job(job_id, employer_id=None):
    query = Job.query.filter_by(id=job_id)
    if employer_id:
        query = query.filter_by(employer_id=employer_id)
    job = query.first()
    if not job:
        return False
    db.session.delete(job)
    db.session.commit()
    return True

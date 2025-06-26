from app.models import Job
from app.database import db_session

def get_all_jobs():
    return db_session.query(Job).all()

def get_job_by_id(job_id):
    return db_session.query(Job).get(job_id)

def create_job(data, employer_id):
    job = Job(
        title=data["title"],
        job_description=data["job_description"],
        location=data.get("location", ""),
        type=data.get("type", ""),
        employer_id=employer_id
    )
    db_session.add(job)
    db_session.commit()
    return job

def get_jobs_by_employer_id(employer_id):
    return db_session.query(Job).filter_by(employer_id=employer_id).all()

def delete_job(job_id, employer_id):
    job = db_session.query(Job).filter_by(id=job_id, employer_id=employer_id).first()
    if not job:
        return False
    db_session.delete(job)
    db_session.commit()
    return True

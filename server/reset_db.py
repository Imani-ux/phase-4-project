# reset_db.py
from app import create_app
from app.database import db

app = create_app()

with app.app_context():
    print("⚠ Dropping and recreating all tables...")
    db.drop_all()
    db.create_all()
    print("✅ Database schema reset successfully.")

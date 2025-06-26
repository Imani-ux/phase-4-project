from app.database import engine
from app.models import Base

print("⚠ Dropping and recreating all tables...")
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)
print("✅ Database schema reset successfully.")

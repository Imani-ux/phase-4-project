from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.database import engine
from app.models import Base
from app.config import Config

# Blueprints
from app.routes.auth_routes import auth_bp
from app.routes.user_routes import user_bp
from app.routes.job_routes import job_bp
from app.routes.application_routes import application_bp
from app.routes.message_routes import message_bp
from app.routes.review_routes import review_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)  # Enable CORS for all routes

    # JWT setup
    jwt = JWTManager(app)

    # DB setup
    Base.metadata.create_all(bind=engine)

    # Root route
    @app.route("/")
    def home():
        return jsonify({"message": "Kazika Kenya backend is running ✅"}), 200

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(job_bp)
    app.register_blueprint(application_bp)
    app.register_blueprint(message_bp)
    app.register_blueprint(review_bp)

    # Optional: print registered routes (for debugging)
    print("\n📌 Registered Routes:")
    for rule in app.url_map.iter_rules():
        print(f"{', '.join(rule.methods)}\t{rule.rule}")
    print()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

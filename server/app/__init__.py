# app/__init__.py

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from app.database import db
from app.config import Config
from app.models import *  # Ensures models are recognized by Flask-Migrate

# Blueprints
from app.routes.auth_routes import auth_bp
from app.routes.user_routes import user_bp
from app.routes.job_routes import job_bp
from app.routes.application_routes import application_bp
from app.routes.message_routes import message_bp
from app.routes.review_routes import review_bp
from app.routes.admin_routes import admin_bp

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)
    CORS(app)

    # ❗Import models *after* db.init_app(app)
    from app import models

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(job_bp)
    app.register_blueprint(application_bp)
    app.register_blueprint(message_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(admin_bp)

    @app.route("/")
    def home():
        return jsonify({"message": "Kazika Kenya backend is running ✅"}), 200

    print("\n📌 Registered Routes:")
    for rule in app.url_map.iter_rules():
        print(f"{', '.join(rule.methods)}\t{rule.rule}")
    print()

    return app

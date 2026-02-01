from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token, 
    jwt_required, 
    get_jwt_identity
)
from app.extensions import db, limiter
from app.models import User
from app.schemas.user_schema import user_to_dict

auth_bp = Blueprint("auth", __name__)

import re

@auth_bp.post("/auth/register")
@limiter.limit("20 per minute")
def register():
    """
    تسجيل مستخدم جديد
    POST /api/auth/register
    Body: { email, password, phone }
    Response: { token, user: { id, name, email } }
    """
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")  # Optional in DB, but if provided, must be valid

    if not email or not password:
        return jsonify({"message": "email and password required"}), 400

    # 1. Email Validation
    if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", email):
        return jsonify({"message": "Invalid email format"}), 400

    # 2. Password Validation (Min 8 chars, 1 letter, 1 number)
    if len(password) < 8 or not re.search(r"[A-Za-z]", password) or not re.search(r"\d", password):
        return jsonify({"message": "Password must be at least 8 chars with 1 letter and 1 number"}), 400

    # 3. Phone Validation (Israel format: +9725XXXXXXXX)
    if phone:
        # Remove spaces/dashes for validation
        clean_phone = re.sub(r"[\s\-]", "", phone)
        if not re.match(r"^\+9725\d{8}$", clean_phone):
             return jsonify({"message": "Phone number must be valid Israel format (+972 5X XXX XXXX)"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "email already exists"}), 409

    user = User(
        email=email,
        password_hash=generate_password_hash(password)
        # Phone storage would go here if model supported it
    )

    db.session.add(user)
    db.session.commit()

    # إنشاء JWT tokens
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "token": access_token,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user_to_dict(user)
    }), 201

@auth_bp.post("/auth/login")
@limiter.limit("20 per minute")
def login():
    """
    تسجيل الدخول
    POST /api/auth/login
    Body: { email, password }
    Response: { token, user: { id, name, email } }
    """
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "email and password required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "invalid credentials"}), 401

    # إنشاء JWT tokens
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "token": access_token,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user_to_dict(user)
    }), 200

@auth_bp.post("/auth/refresh")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify({"access_token": access_token}), 200

@auth_bp.get("/auth/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "user not found"}), 404
    
    return jsonify({
        "id": user.id,
        "email": user.email,
        "created_at": user.created_at.isoformat()
    }), 200

from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db
from app.models import User

class AuthService:
    @staticmethod
    def register_user(email, password):
        if User.query.filter_by(email=email).first():
            return None, "email already exists"

        user = User(
            email=email,
            password_hash=generate_password_hash(password)
        )
        db.session.add(user)
        db.session.commit()
        return user, None

    @staticmethod
    def authenticate_user(email, password):
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return None, "invalid credentials"
        return user, None

    @staticmethod
    def get_user_by_id(user_id):
        return User.query.get(user_id)

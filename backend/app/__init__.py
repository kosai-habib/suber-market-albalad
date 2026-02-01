from flask import Flask, jsonify, request
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate, jwt, limiter

def create_app():
    app = Flask(__name__)
    # CORS configuration for development
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": ["http://localhost:3000"],
                "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "expose_headers": ["Content-Type", "Authorization"],
                "supports_credentials": True,
                "max_age": 3600
            }
        },
        supports_credentials=True
    )
    app.config.from_object(Config)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    # limiter.init_app(app) # Disable limiter for debugging

    # Request logging middleware for debugging
    @app.before_request
    def log_request():
        if request.method != 'OPTIONS':  # Skip OPTIONS preflight logs
            print(f"📥 {request.method} {request.path}")
            if request.get_json(silent=True):
                print(f"   Body: {request.get_json(silent=True)}")
            print(f"   Headers: Authorization={request.headers.get('Authorization', 'None')[:50]}...")

    @app.after_request
    def log_response(response):
        if request.method != 'OPTIONS':
            print(f"📤 {request.method} {request.path} -> {response.status_code}")
        return response

    @app.errorhandler(400)
    @app.errorhandler(401)
    @app.errorhandler(403)
    @app.errorhandler(404)
    @app.errorhandler(429)
    @app.errorhandler(500)
    def handle_error(e):
        code = getattr(e, 'code', 500)
        message = getattr(e, 'description', 'Internal Server Error')
        if code == 429:
            message = "Too many requests. Please slow down."
        return jsonify({"error": message, "status": code}), code

    # Import models here to ensure they are registered with SQLAlchemy
    from . import models

    # Root route
    @app.route('/')
    def index():
        return jsonify({
            "message": "Super Market Al-Balad API",
            "status": "running",
            "version": "1.0.0",
            "endpoints": {
                "health": "/api/health",
                "products": "/api/products",
                "categories": "/api/categories",
                "auth": "/api/auth",
                "cart": "/api/cart",
                "orders": "/api/orders"
            }
        })

    from .routes.health_routes import health_bp
    app.register_blueprint(health_bp, url_prefix="/api")

    from .routes.category_routes import categories_bp
    app.register_blueprint(categories_bp, url_prefix="/api")

    from .routes.product_routes import products_bp
    app.register_blueprint(products_bp, url_prefix="/api")

    from .routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api")

    from .routes.cart_routes import cart_bp
    app.register_blueprint(cart_bp, url_prefix="/api")

    from .routes.order_routes import orders_bp
    app.register_blueprint(orders_bp, url_prefix="/api")

    return app

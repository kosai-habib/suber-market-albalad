from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate, jwt, limiter

def create_app():
    app = Flask(__name__)
    # CORS configuration for development
    CORS(
        app,
        resources={r"/api/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }}
    )
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)

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

    from .routes.health import health_bp
    app.register_blueprint(health_bp, url_prefix="/api")

    from .routes.categories import categories_bp
    app.register_blueprint(categories_bp, url_prefix="/api")

    from .routes.products import products_bp
    app.register_blueprint(products_bp, url_prefix="/api")

    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api")

    from .routes.cart import cart_bp
    app.register_blueprint(cart_bp, url_prefix="/api")

    from .routes.orders import orders_bp
    app.register_blueprint(orders_bp, url_prefix="/api")

    return app

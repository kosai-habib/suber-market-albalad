from flask import Flask, jsonify
from .config import Config
from .extensions import db, migrate, jwt, limiter

def create_app():
    app = Flask(__name__)
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

    from .routes.health import health_bp
    app.register_blueprint(health_bp)

    from .routes.categories import categories_bp
    app.register_blueprint(categories_bp)

    from .routes.products import products_bp
    app.register_blueprint(products_bp)

    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp)

    from .routes.cart import cart_bp
    app.register_blueprint(cart_bp)

    from .routes.orders import orders_bp
    app.register_blueprint(orders_bp)

    return app

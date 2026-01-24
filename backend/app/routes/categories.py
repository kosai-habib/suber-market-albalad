from flask import Blueprint, jsonify
from app.models import Category

categories_bp = Blueprint("categories", __name__)

@categories_bp.get("/categories")
def get_categories():
    categories = Category.query.all()
    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "slug": c.slug
        } for c in categories
    ])

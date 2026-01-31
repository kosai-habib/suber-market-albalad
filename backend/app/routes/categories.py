from flask import Blueprint, jsonify
from flask_cors import cross_origin
from app.models import Category
from app.utils.serializers import category_to_dict

categories_bp = Blueprint("categories", __name__)

@categories_bp.get("/categories")
@cross_origin(origin="http://localhost:3000")
def get_categories():
    """
    يرجع قائمة الفئات كـ array مباشر (بدون wrapper)
    GET /api/categories → [{ id, name, slug }, ...]
    """
    categories = Category.query.order_by(Category.id.asc()).all()
    return jsonify([category_to_dict(c) for c in categories])

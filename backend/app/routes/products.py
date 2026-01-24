from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.models import Product, Category

products_bp = Blueprint("products", __name__)

@products_bp.get("/products")
def get_products():
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 12, type=int)
    category_slug = request.args.get("category")
    discounted = request.args.get("discounted")

    query = Product.query

    if category_slug:
        query = query.join(Category).filter(Category.slug == category_slug)

    if discounted == "true":
        query = query.filter(Product.is_discounted.is_(True))

    pagination = query.paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        "page": page,
        "limit": limit,
        "total_pages": pagination.pages,
        "total_items": pagination.total,
        "items": [
            {
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "image_url": p.image_url,
                "category_id": p.category_id,
                "is_discounted": p.is_discounted,
                "discount_percent": p.discount_percent
            }
            for p in pagination.items
        ]
    })

@products_bp.get("/products/protected")
@jwt_required()
def protected_products():
    return jsonify({"message": "JWT is valid, access granted"})

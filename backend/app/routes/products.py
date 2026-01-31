from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from app.models import Product, Category
from app.utils.serializers import product_to_dict

products_bp = Blueprint("products", __name__)

@products_bp.get("/products")
@cross_origin(origin="http://localhost:3000")
def get_products():
    """
    يرجع قائمة المنتجات كـ array مباشر (بدون pagination wrapper)
    GET /api/products → [{ id, name, price, ... }, ...]
    
    Filters:
    - ?category=<slug> - فلترة حسب الفئة
    - ?discounted=true - المنتجات المخفضة فقط
    - ?q=<search> - البحث في الأسماء
    - ?min_price=<float> - السعر الأدنى
    - ?max_price=<float> - السعر الأعلى
    """
    category_slug = request.args.get("category")
    discounted = request.args.get("discounted")
    search_query = request.args.get("q")
    min_price = request.args.get("min_price", type=float)
    max_price = request.args.get("max_price", type=float)

    # بناء الاستعلام
    query = Product.query

    # فلتر الفئة
    if category_slug:
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)
        else:
            # إذا الفئة غير موجودة، نرجع array فاضي
            return jsonify([])

    # فلتر المنتجات المخفضة
    if discounted == "true":
        query = query.filter(Product.is_discounted.is_(True))

    # البحث في الأسماء
    if search_query:
        query = query.filter(Product.name.ilike(f"%{search_query}%"))

    # فلاتر السعر
    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # جلب النتائج
    products = query.order_by(Product.id.asc()).all()
    
    return jsonify([product_to_dict(p) for p in products])

@products_bp.get("/products/<int:product_id>")
def get_product(product_id):
    p = Product.query.get_or_404(product_id)
    return jsonify({
        "id": p.id,
        "name": p.name,
        "price": p.price,
        "image_url": p.image_url,
        "category_id": p.category_id,
        "category_name": p.category.name if p.category else None,
        "category_image": p.category.image_url if p.category else None,
        "is_discounted": p.is_discounted,
        "discount_percent": p.discount_percent,
        "unit": p.unit,
        "badge": p.badge
    })

@products_bp.get("/products/protected")
@jwt_required()
def protected_products():
    return jsonify({"message": "JWT is valid, access granted"})

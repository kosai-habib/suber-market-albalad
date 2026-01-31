from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import CartItem, Product

cart_bp = Blueprint("cart", __name__)

@cart_bp.post("/cart")
@jwt_required()
def add_to_cart():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    if not product_id:
        return jsonify({"message": "product_id is required"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "product not found"}), 404

    item = CartItem.query.filter_by(
        user_id=user_id,
        product_id=product_id
    ).first()

    if item:
        item.quantity += quantity
    else:
        item = CartItem(
            user_id=user_id,
            product_id=product_id,
            quantity=quantity
        )
        db.session.add(item)

    db.session.commit()

    return jsonify({"message": "item added to cart"}), 200

@cart_bp.get("/cart")
@jwt_required()
def view_cart():
    user_id = int(get_jwt_identity())

    items = (
        db.session.query(CartItem)
        .filter_by(user_id=user_id)
        .join(Product)
        .all()
    )

    return jsonify([
        {
            "id": item.id,
            "product": {
                "id": item.product.id,
                "name": item.product.name,
                "price": item.product.price,
                "image_url": item.product.image_url,
                "unit": item.product.unit,
                "badge": item.product.badge
            },
            "quantity": item.quantity
        }
        for item in items
    ])

@cart_bp.delete("/cart/<int:item_id>")
@jwt_required()
def remove_from_cart(item_id):
    user_id = int(get_jwt_identity())

    item = CartItem.query.filter_by(
        id=item_id,
        user_id=user_id
    ).first()

    if not item:
        return jsonify({"message": "item not found"}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({"message": "item removed from cart"}), 200

@cart_bp.route("/cart/<int:item_id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_cart_item(item_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()

    quantity = data.get("quantity")

    if not quantity or quantity < 1:
        return jsonify({"message": "quantity must be >= 1"}), 400

    item = CartItem.query.filter_by(
        id=item_id,
        user_id=user_id
    ).first()

    if not item:
        return jsonify({"message": "item not found"}), 404

    item.quantity = quantity
    db.session.commit()

    return jsonify({"message": "cart item updated"}), 200

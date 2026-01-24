from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import CartItem, Order, OrderItem, Product

orders_bp = Blueprint("orders", __name__)

@orders_bp.post("/orders/checkout")
@jwt_required()
def checkout():
    user_id = int(get_jwt_identity())

    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"message": "cart is empty"}), 400

    total_price = 0.0
    order_items = []

    for item in cart_items:
        product = Product.query.get(item.product_id)
        line_total = product.price * item.quantity
        total_price += line_total

        order_items.append(
            OrderItem(
                product_id=product.id,
                quantity=item.quantity,
                price_at_purchase=product.price
            )
        )

    order = Order(
        user_id=user_id,
        total_price=total_price
    )
    db.session.add(order)
    db.session.flush()  # للحصول على order.id

    for oi in order_items:
        oi.order_id = order.id
        db.session.add(oi)

    # تفريغ السلة
    CartItem.query.filter_by(user_id=user_id).delete()

    db.session.commit()

    return jsonify({
        "message": "order created",
        "order_id": order.id,
        "total_price": total_price
    }), 201

@orders_bp.get("/orders")
@jwt_required()
def order_history():
    user_id = int(get_jwt_identity())

    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 10, type=int)

    pagination = (
        Order.query
        .filter_by(user_id=user_id)
        .order_by(Order.created_at.desc())
        .paginate(page=page, per_page=limit, error_out=False)
    )

    return jsonify({
        "page": page,
        "limit": limit,
        "total_pages": pagination.pages,
        "total_items": pagination.total,
        "items": [
            {
                "order_id": order.id,
                "total_price": order.total_price,
                "status": order.status,
                "created_at": order.created_at.isoformat()
            }
            for order in pagination.items
        ]
    })

@orders_bp.get("/orders/<int:order_id>")
@jwt_required()
def order_details(order_id):
    user_id = int(get_jwt_identity())

    order = Order.query.filter_by(
        id=order_id,
        user_id=user_id
    ).first()

    if not order:
        return jsonify({"message": "order not found"}), 404

    items = (
        OrderItem.query
        .filter_by(order_id=order.id)
        .join(Product)
        .all()
    )

    return jsonify({
        "order_id": order.id,
        "total_price": order.total_price,
        "status": order.status,
        "created_at": order.created_at.isoformat(),
        "items": [
            {
                "product_id": item.product_id,
                "product_name": item.product.name,
                "quantity": item.quantity,
                "price_at_purchase": item.price_at_purchase,
                "line_total": item.price_at_purchase * item.quantity
            }
            for item in items
        ]
    })

@orders_bp.put("/orders/<int:order_id>/status")
@jwt_required()
def update_order_status(order_id):
    # For now, we only protect with JWT. Later we can add Admin-only check.
    data = request.get_json()
    new_status = data.get("status")

    valid_statuses = ["pending", "paid", "shipped", "completed", "cancelled"]
    if new_status not in valid_statuses:
        return jsonify({"message": f"Invalid status. Must be one of {valid_statuses}"}), 400

    order = Order.query.get(order_id)
    if not order:
        return jsonify({"message": "order not found"}), 404

    order.status = new_status
    db.session.commit()

    return jsonify({
        "message": "order status updated",
        "order_id": order.id,
        "new_status": order.status
    })

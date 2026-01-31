from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import CartItem, Order, OrderItem, Product

orders_bp = Blueprint("orders", __name__)

@orders_bp.post("/orders/checkout")
@jwt_required()
def checkout():
    """
    Simplified Checkout endpoint (Mock Payment)
    """
    user_id = int(get_jwt_identity())
    data = request.get_json(force=True)

    if 'payment_method' not in data:
        return jsonify({'error': 'payment_method is required'}), 400

    payment_method = data['payment_method']

    # 2) Validate cart
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"message": "Cart is empty"}), 400

    # 3) Create Order & Calculate Total
    subtotal = sum(item.product.price * item.quantity for item in cart_items)
    logistics_fee = 10.0
    total = subtotal + logistics_fee

    order = Order(
        user_id=user_id,
        total_price=total,
        status="processing",
        payment_method=payment_method,
        payment_status="paid (mock)",
        order_status="processing",
        subtotal=subtotal,
        logistics_fee=logistics_fee,
        total=total
    )
    db.session.add(order)
    db.session.flush()

    # 4) Move Cart → OrderItems & Delete Cart
    for item in cart_items:
        db.session.add(OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_purchase=item.product.price
        ))
        db.session.delete(item)

    # 5) Commit + Response
    db.session.commit()

    return jsonify({
        "status": "success",
        "order_id": order.id,
        "payment_status": "paid (mock)",
        "total": total
    }), 200

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
                "payment_method": order.payment_method,
                "payment_status": order.payment_status,
                "order_status": order.order_status,
                "subtotal": order.subtotal,
                "logistics_fee": order.logistics_fee,
                "total": order.total,
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
        "payment_method": order.payment_method,
        "payment_status": order.payment_status,
        "order_status": order.order_status,
        "subtotal": order.subtotal,
        "logistics_fee": order.logistics_fee,
        "total": order.total,
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

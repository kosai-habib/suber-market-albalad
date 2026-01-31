from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.order_service import (
    create_order_from_cart,
    get_user_orders,
    get_order_details
)
from app.utils.order_utils import (
    format_order_response,
    format_order_with_items
)

orders_bp = Blueprint("orders", __name__)


@orders_bp.post("/orders/checkout")
@jwt_required()
def checkout():
    user_id = int(get_jwt_identity())
    data = request.get_json(force=True)

    if 'payment_method' not in data:
        return jsonify({'error': 'payment_method is required'}), 400

    try:
        order = create_order_from_cart(user_id, data['payment_method'])
        
        return jsonify({
            "status": "success",
            "order_id": order.id,
            "order_number": order.order_number,
            "paid_at": order.paid_at.isoformat(),
            "payment_status": order.payment_status,
            "total": order.total
        }), 200
        
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


@orders_bp.get("/orders")
@jwt_required()
def order_history():
    user_id = int(get_jwt_identity())
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 10, type=int)

    pagination = get_user_orders(user_id, page, limit)

    return jsonify({
        "page": page,
        "limit": limit,
        "total_pages": pagination.pages,
        "total_items": pagination.total,
        "items": [format_order_response(order) for order in pagination.items]
    })


@orders_bp.get("/orders/<int:order_id>")
@jwt_required()
def order_details(order_id):
    user_id = int(get_jwt_identity())

    try:
        order = get_order_details(user_id, order_id)
        return jsonify(format_order_with_items(order))
    except ValueError as e:
        return jsonify({"message": str(e)}), 404


@orders_bp.put("/orders/<int:order_id>/status")
@jwt_required()
def update_order_status(order_id):
    data = request.get_json()
    new_status = data.get("status")

    valid_statuses = ["pending", "paid", "shipped", "completed", "cancelled"]
    if new_status not in valid_statuses:
        return jsonify({"message": f"Invalid status. Must be one of {valid_statuses}"}), 400

    try:
        order = get_order_details(int(get_jwt_identity()), order_id)
        order.status = new_status
        from app.extensions import db
        db.session.commit()

        return jsonify({
            "message": "order status updated",
            "order_id": order.id,
            "new_status": order.status
        })
    except ValueError:
        return jsonify({"message": "order not found"}), 404


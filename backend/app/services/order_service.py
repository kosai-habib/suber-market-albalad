from datetime import datetime
import random
from app.extensions import db
from app.models import Order, OrderItem, CartItem


def generate_order_number():
    year = datetime.utcnow().year
    random_digits = random.randint(10000, 99999)
    return f"ALB-{year}-{random_digits}"


def calculate_order_totals(cart_items):
    subtotal = sum(item.product.price * item.quantity for item in cart_items)
    logistics_fee = 10.0
    total = subtotal + logistics_fee
    
    return {
        'subtotal': subtotal,
        'logistics_fee': logistics_fee,
        'total': total
    }


def create_order_from_cart(user_id, payment_method):
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    
    if not cart_items:
        raise ValueError("Cart is empty")
    
    totals = calculate_order_totals(cart_items)
    
    order = Order(
        user_id=user_id,
        order_number=generate_order_number(),
        paid_at=datetime.utcnow(),
        total_price=totals['total'],
        status="processing",
        payment_method=payment_method,
        payment_status="paid (mock)",
        order_status="processing",
        subtotal=totals['subtotal'],
        logistics_fee=totals['logistics_fee'],
        total=totals['total']
    )
    db.session.add(order)
    db.session.flush()
    
    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_purchase=item.product.price,
            line_total=item.product.price * item.quantity
        )
        db.session.add(order_item)
        db.session.delete(item)
    
    db.session.commit()
    
    return order


def get_user_orders(user_id, page=1, per_page=10):
    pagination = Order.query.filter_by(user_id=user_id)\
        .order_by(Order.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
    
    return pagination


def get_order_details(user_id, order_id):
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    
    if not order:
        raise ValueError("Order not found")
    
    return order

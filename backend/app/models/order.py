from datetime import datetime
from ..extensions import db

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(32), unique=True, nullable=True)
    paid_at = db.Column(db.DateTime, nullable=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="pending", nullable=False)
    
    payment_method = db.Column(db.String(50), nullable=True)
    payment_status = db.Column(db.String(20), default="pending", nullable=True)
    
    order_status = db.Column(db.String(20), default="pending", nullable=True)
    
    subtotal = db.Column(db.Float, nullable=True)
    logistics_fee = db.Column(db.Float, nullable=True)
    total = db.Column(db.Float, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    order_items = db.relationship("OrderItem", backref="order", lazy=True)

class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(
        db.Integer,
        db.ForeignKey("orders.id"),
        nullable=False
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )

    quantity = db.Column(db.Integer, nullable=False)

    price_at_purchase = db.Column(db.Float, nullable=False)
    line_total = db.Column(db.Float, nullable=True)
    product = db.relationship("Product", backref="order_items")

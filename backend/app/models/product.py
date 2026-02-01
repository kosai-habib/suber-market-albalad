from ..extensions import db

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255))
    
    category_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.id"),
        nullable=False
    )
    category = db.relationship("Category", backref="products")

    is_discounted = db.Column(db.Boolean, default=False)
    discount_percent = db.Column(db.Integer, nullable=True)
    unit = db.Column(db.String(50), nullable=True)
    badge = db.Column(db.String(50), nullable=True)

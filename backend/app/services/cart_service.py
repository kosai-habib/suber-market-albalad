from app.extensions import db
from app.models import CartItem, Product

class CartService:
    @staticmethod
    def add_item(user_id, product_id, quantity=1):
        product = Product.query.get(product_id)
        if not product:
            return None, "product not found"

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
        return item, None

    @staticmethod
    def get_user_cart(user_id):
        return db.session.query(CartItem).filter_by(user_id=user_id).join(Product).all()

    @staticmethod
    def remove_item(user_id, item_id):
        item = CartItem.query.filter_by(
            id=item_id,
            user_id=user_id
        ).first()

        if not item:
            return False, "item not found"

        db.session.delete(item)
        db.session.commit()
        return True, None

    @staticmethod
    def update_item_quantity(user_id, item_id, quantity):
        if quantity < 1:
            return None, "quantity must be >= 1"

        item = CartItem.query.filter_by(
            id=item_id,
            user_id=user_id
        ).first()

        if not item:
            return None, "item not found"

        item.quantity = quantity
        db.session.commit()
        return item, None

from app import create_app
from app.extensions import db
from app.models import Category, Product

def seed_categories():
    # Check if categories already exist
    if Category.query.first():
        print("Categories already exist, skipping seed_categories.")
        return

    categories = [
        Category(name="Meat", slug="meat"),
        Category(name="Dairy", slug="dairy"),
        Category(name="Produce", slug="produce"),
        Category(name="Bakery", slug="bakery"),
        Category(name="Beverages", slug="beverages"),
        Category(name="Frozen", slug="frozen"),
        Category(name="Pantry", slug="pantry"),
        Category(name="Household", slug="household"),
    ]

    db.session.bulk_save_objects(categories)
    db.session.commit()

def seed_products():
    # Check if products already exist
    if Product.query.first():
        print("Products already exist, skipping seed_products.")
        return

    products = [
        Product(
            name="Fresh Beef",
            price=45.0,
            image_url="https://via.placeholder.com/150",
            category_id=1,
            is_discounted=True,
            discount_percent=10
        ),
        Product(
            name="Chicken Breast",
            price=28.0,
            image_url="https://via.placeholder.com/150",
            category_id=1,
            is_discounted=False
        ),
        Product(
            name="Milk 1L",
            price=6.5,
            image_url="https://via.placeholder.com/150",
            category_id=2,
            is_discounted=True,
            discount_percent=5
        ),
        Product(
            name="Cheddar Cheese",
            price=18.0,
            image_url="https://via.placeholder.com/150",
            category_id=2,
            is_discounted=False
        ),
    ]

    db.session.bulk_save_objects(products)
    db.session.commit()

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        seed_categories()
        seed_products()

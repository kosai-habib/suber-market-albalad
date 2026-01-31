import json
import os

# Auto-detect database and set environment variable BEFORE importing app
# This ensures that Config class (evaluated at import) picks up the correct URL
base_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(base_dir, 'instance', 'supermarket.db')

if os.path.exists(db_path):
    print(f"🔌 Auto-configuring database: {db_path}")
    os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"
else:
    print("⚠️  'instance/supermarket.db' not found. Will use default.")

from app import create_app
from app.extensions import db
from app.models import Product, Category

def seed_products():
    """
    Seeds the database with new products from seed_products.json.
    Ensures no duplicates and respects existing categories.
    """
    app = create_app()
    with app.app_context():
        # Correct path for JSON logic
        json_path = os.path.join(base_dir, 'seed_products.json')
        
        if not os.path.exists(json_path):
            print(f"Error: {json_path} not found.")
            return

        with open(json_path, 'r') as f:
            products_data = json.load(f)

        print(f"Loaded {len(products_data)} products from JSON.")
        
        added_count = 0
        skipped_count = 0
        category_error_count = 0

        for item in products_data:
            # 1. Resolve Category (Case-insensitive)
            cat_name = item['category']
            category = Category.query.filter(Category.name.ilike(cat_name)).first()
            
            if not category:
                # Fallback: Try matching by partial string or safe defaults if needed? 
                # Requirement: "No new categories". So strictly rely on existing.
                print(f"⚠️  Skipping '{item['name']}': Category '{cat_name}' not found in DB.")
                category_error_count += 1
                continue

            # 2. Check for Duplicates (by Name)
            existing_product = Product.query.filter(Product.name.ilike(item['name'])).first()
            if existing_product:
                print(f"ℹ️  Skipping '{item['name']}': Already exists.")
                skipped_count += 1
                continue

            # 3. Create New Product
            # Extract unit from name if present (e.g. " (1kg)")
            unit = "Item"
            name = item['name']
            if "(" in name and ")" in name:
                unit_part = name.split("(")[-1].replace(")", "")
                unit = unit_part
            
            new_product = Product(
                name=name,
                price=item['price'],
                image_url=item['image'],
                category_id=category.id,
                # Default attributes for consistency
                is_discounted=False, 
                discount_percent=None,
                unit=unit,
                badge="Fresh" # Default badge as requested by "Fresh / Daily" logic
            )
            
            db.session.add(new_product)
            added_count += 1
            print(f"✅ Added '{item['name']}' to '{category.name}'")

        if added_count > 0:
            db.session.commit()
            print(f"\n🎉 Success! Added {added_count} new products.")
        else:
            print("\nDatabase is already up to date. No new products added.")
            
        print(f"Stats: Added={added_count}, Skipped={skipped_count}, MissingCat={category_error_count}")

if __name__ == "__main__":
    seed_products()

"""
Seed Script - باستخدام الصور المحلية
أسماء بسيطة + صور احترافية محلية
"""

from app import create_app
from app.extensions import db
from app.models import Category, Product

app = create_app()

# مطابقة أسماء المنتجات مع أسماء الصور
IMAGE_MAPPING = {
    # Produce - متوفرة
    "Apples": "apple.png",
    "Bananas": "banana.png",
    "Tomatoes": "tomato.png",
    "Carrots": "carrot.png",
    "Bell Peppers": "capsicum.png",
    "Oranges": "orange.png",
    "Strawberries": "strawberry.png",
    "Watermelon": "watermelon.png",
    "Broccoli": "broccoli.png",
    "Cabbage": "cabbage.png",
    "Cauliflower": "cauliflower.png",
    "Grapes": "blue grapes.png",
    "Green Grapes": "green grapes.png",
    
    # Meat - متوفرة
    "Chicken": "chicken.png",
    "Chicken Legs": "chicken leg pieces.png",
    "Beef Steak": "beaf steak.png",
    
    # Fish - متوفرة  
    "Salmon": "salmon fish.png",
    "Fish": "oily fishes.png",
}

def get_image_url(product_name):
    """الحصول على URL الصورة المحلية أو placeholder"""
    image_file = IMAGE_MAPPING.get(product_name)
    if image_file:
        return f"/images/products/{image_file}"
    # fallback to placeholder
    return f"/images/products/placeholder.png"


def seed_categories():
    """إضافة 8 فئات أساسية"""
    categories_data = [
        {"name": "Meat & Poultry", "slug": "meat"},
        {"name": "Dairy & Eggs", "slug": "dairy"},
        {"name": "Fresh Produce", "slug": "produce"},
        {"name": "Bakery", "slug": "bakery"},
        {"name": "Beverages", "slug": "beverages"},
        {"name": "Frozen Foods", "slug": "frozen"},
        {"name": "Pantry Staples", "slug": "pantry"},
        {"name": "Household Items", "slug": "household"},
    ]
    
    for cat_data in categories_data:
        existing = Category.query.filter_by(slug=cat_data["slug"]).first()
        if not existing:
            cat = Category(**cat_data)
            db.session.add(cat)
            print(f"✅ {cat_data['name']}")
    
    db.session.commit()


def seed_products_with_local_images():
    """منتجات بصور محلية"""
    
    categories = {cat.slug: cat for cat in Category.query.all()}
    
    products_data = [
        # === Meat & Poultry (صور متوفرة) ===
        {"name": "Chicken", "price": 45.90, "category": "meat", "has_image": True},
        {"name": "Chicken Legs", "price": 38.50, "category": "meat", "has_image": True},
        {"name": "Beef Steak", "price": 95.00, "category": "meat", "is_discounted": True, "discount_percent": 10, "has_image": True},
        {"name": "Ground Beef", "price": 52.00, "category": "meat", "is_discounted": True, "discount_percent": 15},
        {"name": "Lamb Chops", "price": 89.90, "category": "meat"},
        {"name": "Turkey", "price": 42.00, "category": "meat"},
        
        # === Fresh Produce (صور متوفرة) ===
        {"name": "Apples", "price": 12.90, "category": "produce", "has_image": True},
        {"name": "Bananas", "price": 9.90, "category": "produce", "has_image": True},
        {"name": "Tomatoes", "price": 8.90, "category": "produce", "has_image": True},
        {"name": "Carrots", "price": 7.50, "category": "produce", "is_discounted": True, "discount_percent": 10, "has_image": True},
        {"name": "Bell Peppers", "price": 11.90, "category": "produce", "has_image": True},
        {"name": "Oranges", "price": 14.90, "category": "produce", "has_image": True},
        {"name": "Strawberries", "price": 24.90, "category": "produce", "has_image": True},
        {"name": "Watermelon", "price": 18.50, "category": "produce", "has_image": True},
        {"name": "Broccoli", "price": 9.90, "category": "produce", "has_image": True},
        {"name": "Cabbage", "price": 6.90, "category": "produce", "has_image": True},
        {"name": "Cauliflower", "price": 8.50, "category": "produce", "has_image": True},
        {"name": "Grapes", "price": 22.90, "category": "produce", "has_image": True},
        {"name": "Green Grapes", "price": 21.90, "category": "produce", "has_image": True},
        {"name": "Cucumbers", "price": 6.50, "category": "produce", "is_discounted": True, "discount_percent": 25},
        {"name": "Lettuce", "price": 5.90, "category": "produce"},
        {"name": "Spinach", "price": 8.50, "category": "produce"},
        
        # === Dairy & Eggs ===
        {"name": "Milk", "price": 6.90, "category": "dairy"},
        {"name": "Greek Yogurt", "price": 12.90, "category": "dairy", "is_discounted": True, "discount_percent": 20},
        {"name": "Cheddar Cheese", "price": 28.50, "category": "dairy"},
        {"name": "Eggs", "price": 18.90, "category": "dairy"},
        {"name": "Butter", "price": 15.90, "category": "dairy"},
        {"name": "Cottage Cheese", "price": 14.50, "category": "dairy", "is_discounted": True, "discount_percent": 15},
        {"name": "Cream Cheese", "price": 16.90, "category": "dairy"},
        
        # === Bakery ===
        {"name": "Bread", "price": 8.90, "category": "bakery"},
        {"name": "Croissants", "price": 16.90, "category": "bakery", "is_discounted": True, "discount_percent": 20},
        {"name": "Pita Bread", "price": 6.50, "category": "bakery"},
        {"name": "Bagels", "price": 12.90, "category": "bakery"},
        {"name": "Dinner Rolls", "price": 9.90, "category": "bakery", "is_discounted": True, "discount_percent": 15},
        
        # === Beverages ===
        {"name": "Orange Juice", "price": 12.90, "category": "beverages"},
        {"name": "Coca Cola", "price": 8.50, "category": "beverages", "is_discounted": True, "discount_percent": 15},
        {"name": "Water", "price": 15.90, "category": "beverages"},
        {"name": "Apple Juice", "price": 11.90, "category": "beverages"},
        {"name": "Energy Drink", "price": 6.90, "category": "beverages"},
        {"name": "Iced Tea", "price": 7.50, "category": "beverages", "is_discounted": True, "discount_percent": 10},
        
        # === Frozen Foods ===
        {"name": "Pizza", "price": 28.90, "category": "frozen"},
        {"name": "Ice Cream", "price": 22.90, "category": "frozen", "is_discounted": True, "discount_percent": 25},
        {"name": "Frozen Vegetables", "price": 16.50, "category": "frozen"},
        {"name": "Fish Fingers", "price": 32.90, "category": "frozen"},
        {"name": "French Fries", "price": 18.90, "category": "frozen", "is_discounted": True, "discount_percent": 20},
        
        # === Fish (صور متوفرة) ===
        {"name": "Salmon", "price": 85.00, "category": "frozen", "has_image": True},
        {"name": "Fish", "price": 65.00, "category": "frozen", "has_image": True},
        
        # === Pantry Staples ===
        {"name": "Pasta", "price": 8.90, "category": "pantry"},
        {"name": "Rice", "price": 12.50, "category": "pantry", "is_discounted": True, "discount_percent": 15},
        {"name": "Olive Oil", "price": 42.90, "category": "pantry"},
        {"name": "Honey", "price": 38.50, "category": "pantry"},
        {"name": "Flour", "price": 7.50, "category": "pantry", "is_discounted": True, "discount_percent": 10},
        {"name": "Sugar", "price": 6.90, "category": "pantry"},
        
        # === Household Items ===
        {"name": "Dish Soap", "price": 12.90, "category": "household"},
        {"name": "Laundry Detergent", "price": 32.90, "category": "household", "is_discounted": True, "discount_percent": 20},
        {"name": "Paper Towels", "price": 22.50, "category": "household"},
        {"name": "Toilet Paper", "price": 28.90, "category": "household"},
    ]
    
    added = 0
    updated = 0
    
    for prod_data in products_data:
        category = categories.get(prod_data.pop("category"))
        if not category:
            continue
        
        has_image = prod_data.pop("has_image", False)
        name = prod_data["name"]
        
        # الحصول على URL الصورة
        image_url = get_image_url(name) if has_image else None
        
        # تحقق إذا المنتج موجود
        existing = Product.query.filter_by(
            name=name,
            category_id=category.id
        ).first()
        
        if existing:
            # تحديث الصورة إذا موجودة
            if has_image and image_url:
                existing.image_url = image_url
                updated += 1
                print(f"🔄 {name} (updated image)")
        else:
            # إضافة منتج جديد
            product = Product(
                **prod_data,
                category_id=category.id,
                image_url=image_url
            )
            db.session.add(product)
            added += 1
            
            # طباعة حالة الإضافة
            symbol = "🖼️" if has_image else "📦"
            if prod_data.get("is_discounted"):
                symbol = "🔥"
            print(f"{symbol} {name}")
    
    db.session.commit()
    print(f"\n✅ أضيف {added} منتج جديد")
    print(f"🔄 حُدث {updated} منتج بصور محلية\n")


def main():
    with app.app_context():
        print("\n" + "="*60)
        print("🌱 Seed Database - Local Images")
        print("="*60 + "\n")
        
        print("📂 الفئات...")
        seed_categories()
        
        print("\n🛒 المنتجات (صور محلية)...")
        seed_products_with_local_images()
        
        # إحصائيات
        total_categories = Category.query.count()
        total_products = Product.query.count()
        discounted = Product.query.filter_by(is_discounted=True).count()
        with_images = Product.query.filter(Product.image_url.isnot(None)).count()
        local_images = Product.query.filter(Product.image_url.like('/images/products/%')).count()
        
        print("="*60)
        print("✅ اكتمل!")
        print("="*60)
        print(f"📊 الإحصائيات:")
        print(f"   - الفئات: {total_categories}")
        print(f"   - المنتجات: {total_products}")
        print(f"   - المنتجات المخفضة: {discounted}")
        print(f"   - منتجات بصور: {with_images}")
        print(f"   - صور محلية: {local_images}")
        print("="*60 + "\n")


if __name__ == "__main__":
    main()

"""
Seed Script محسّن - يضيف 8 فئات + 50+ منتج
يضمن: منتجات متنوعة، بعضها بتخفيضات، مع أسعار واقعية
"""

from app import create_app
from app.extensions import db
from app.models import Category, Product

app = create_app()

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
        # تحقق إذا موجودة
        existing = Category.query.filter_by(slug=cat_data["slug"]).first()
        if not existing:
            cat = Category(**cat_data)
            db.session.add(cat)
            print(f"✅ أضيفت فئة: {cat_data['name']}")
        else:
            print(f"⏭️  فئة موجودة: {cat_data['name']}")
    
    db.session.commit()
    print("\n✅ تم إضافة/تحديث الفئات\n")


def seed_products():
    """إضافة 50+ منتج موزعة على الفئات"""
    
    # جلب الفئات
    categories = {cat.slug: cat for cat in Category.query.all()}
    
    products_data = [
        # Meat & Poultry (7 منتجات)
        {"name": "Fresh Chicken Breast", "price": 45.90, "category": "meat", "is_discounted": False},
        {"name": "Ground Beef", "price": 52.00, "category": "meat", "is_discounted": True, "discount_percent": 15},
        {"name": "Lamb Chops", "price": 89.90, "category": "meat", "is_discounted": False},
        {"name": "Turkey Breast", "price": 38.50, "category": "meat", "is_discounted": False},
        {"name": "Beef Steak", "price": 95.00, "category": "meat", "is_discounted": True, "discount_percent": 10},
        {"name": "Chicken Wings", "price": 32.90, "category": "meat", "is_discounted": False},
        {"name": "Minced Chicken", "price": 36.00, "category": "meat", "is_discounted": False},
        
        # Dairy & Eggs (7 منتجات)
        {"name": "Fresh Milk 3%", "price": 6.90, "category": "dairy", "is_discounted": False},
        {"name": "Greek Yogurt", "price": 12.90, "category": "dairy", "is_discounted": True, "discount_percent": 20},
        {"name": "Cheddar Cheese", "price": 28.50, "category": "dairy", "is_discounted": False},
        {"name": "Organic Eggs (12)", "price": 18.90, "category": "dairy", "is_discounted": False},
        {"name": "Butter 200g", "price": 15.90, "category": "dairy", "is_discounted": False},
        {"name": "Cottage Cheese", "price": 14.50, "category": "dairy", "is_discounted": True, "discount_percent": 15},
        {"name": "Cream Cheese", "price": 16.90, "category": "dairy", "is_discounted": False},
        
        # Fresh Produce (8 منتجات)
        {"name": "Tomatoes 1kg", "price": 8.90, "category": "produce", "is_discounted": False},
        {"name": "Cucumbers 1kg", "price": 6.50, "category": "produce", "is_discounted": True, "discount_percent": 25},
        {"name": "Fresh Lettuce", "price": 5.90, "category": "produce", "is_discounted": False},
        {"name": "Red Apples 1kg", "price": 12.90, "category": "produce", "is_discounted": False},
        {"name": "Bananas 1kg", "price": 9.90, "category": "produce", "is_discounted": False},
        {"name": "Carrots 1kg", "price": 7.50, "category": "produce", "is_discounted": True, "discount_percent": 10},
        {"name": "Bell Peppers 1kg", "price": 11.90, "category": "produce", "is_discounted": False},
        {"name": "Fresh Spinach", "price": 8.50, "category": "produce", "is_discounted": False},
        
        # Bakery (6 منتجات)
        {"name": "Whole Wheat Bread", "price": 8.90, "category": "bakery", "is_discounted": False},
        {"name": "Croissants (6 pack)", "price": 16.90, "category": "bakery", "is_discounted": True, "discount_percent": 20},
        {"name": "Pita Bread (10)", "price": 6.50, "category": "bakery", "is_discounted": False},
        {"name": "Chocolate Cake", "price": 45.00, "category": "bakery", "is_discounted": False},
        {"name": "Bagels (6 pack)", "price": 12.90, "category": "bakery", "is_discounted": False},
        {"name": "Dinner Rolls (12)", "price": 9.90, "category": "bakery", "is_discounted": True, "discount_percent": 15},
        
        # Beverages (8 منتجات)
        {"name": "Orange Juice 1L", "price": 12.90, "category": "beverages", "is_discounted": False},
        {"name": "Coca Cola 2L", "price": 8.50, "category": "beverages", "is_discounted": True, "discount_percent": 15},
        {"name": "Mineral Water 6x1.5L", "price": 15.90, "category": "beverages", "is_discounted": False},
        {"name": "Apple Juice 1L", "price": 11.90, "category": "beverages", "is_discounted": False},
        {"name": "Energy Drink", "price": 6.90, "category": "beverages", "is_discounted": False},
        {"name": "Iced Tea 1.5L", "price": 7.50, "category": "beverages", "is_discounted": True, "discount_percent": 10},
        {"name": "Fresh Lemonade 1L", "price": 9.90, "category": "beverages", "is_discounted": False},
        {"name": "Sparkling Water 1L", "price": 5.50, "category": "beverages", "is_discounted": False},
        
        # Frozen Foods (6 منتجات)
        {"name": "Frozen Pizza", "price": 28.90, "category": "frozen", "is_discounted": False},
        {"name": "Ice Cream Vanilla 1L", "price": 22.90, "category": "frozen", "is_discounted": True, "discount_percent": 25},
        {"name": "Frozen Vegetables Mix", "price": 16.50, "category": "frozen", "is_discounted": False},
        {"name": "Fish Fingers", "price": 32.90, "category": "frozen", "is_discounted": False},
        {"name": "Frozen French Fries", "price": 18.90, "category": "frozen", "is_discounted": True, "discount_percent": 20},
        {"name": "Frozen Berries Mix", "price": 24.50, "category": "frozen", "is_discounted": False},
        
        # Pantry Staples (7 منتجات)
        {"name": "Pasta 500g", "price": 8.90, "category": "pantry", "is_discounted": False},
        {"name": "Rice 1kg", "price": 12.50, "category": "pantry", "is_discounted": True, "discount_percent": 15},
        {"name": "Olive Oil 1L", "price": 42.90, "category": "pantry", "is_discounted": False},
        {"name": "Tomato Sauce", "price": 9.90, "category": "pantry", "is_discounted": False},
        {"name": "Honey 500g", "price": 38.50, "category": "pantry", "is_discounted": False},
        {"name": "Flour 1kg", "price": 7.50, "category": "pantry", "is_discounted": True, "discount_percent": 10},
        {"name": "Sugar 1kg", "price": 6.90, "category": "pantry", "is_discounted": False},
        
        # Household Items (6 منتجات)
        {"name": "Dish Soap", "price": 12.90, "category": "household", "is_discounted": False},
        {"name": "Laundry Detergent", "price": 32.90, "category": "household", "is_discounted": True, "discount_percent": 20},
        {"name": "Paper Towels (6)", "price": 22.50, "category": "household", "is_discounted": False},
        {"name": "Toilet Paper (12)", "price": 28.90, "category": "household", "is_discounted": False},
        {"name": "Sponges (5 pack)", "price": 8.90, "category": "household", "is_discounted": False},
        {"name": "Garbage Bags", "price": 16.50, "category": "household", "is_discounted": True, "discount_percent": 15},
    ]
    
    added_count = 0
    for prod_data in products_data:
        # جلب الفئة
        category = categories.get(prod_data.pop("category"))
        if not category:
            print(f"⚠️  فئة غير موجودة لـ: {prod_data['name']}")
            continue
        
        # تحقق إذا المنتج موجود
        existing = Product.query.filter_by(
            name=prod_data["name"], 
            category_id=category.id
        ).first()
        
        if not existing:
            product = Product(
                **prod_data,
                category_id=category.id,
                image_url=f"https://placehold.co/400x400/1a1a1a/ffffff?text={prod_data['name'].replace(' ', '+')}"
            )
            db.session.add(product)
            added_count += 1
            
            # طباعة حالة الإضافة
            if prod_data.get("is_discounted"):
                print(f"🔥 {prod_data['name']} - ₪{prod_data['price']:.2f} (SALE -{prod_data.get('discount_percent', 0)}%)")
            else:
                print(f"✅ {prod_data['name']} - ₪{prod_data['price']:.2f}")
    
    db.session.commit()
    print(f"\n✅ تم إضافة {added_count} منتج جديد\n")


def main():
    """تشغيل الـ seed script"""
    with app.app_context():
        print("\n" + "="*60)
        print("🌱 بدء Seed Database")
        print("="*60 + "\n")
        
        # الخطوة 1: الفئات
        print("📂 إضافة الفئات...")
        seed_categories()
        
        # الخطوة 2: المنتجات
        print("🛒 إضافة المنتجات...")
        seed_products()
        
        # إحصائيات
        total_categories = Category.query.count()
        total_products = Product.query.count()
        discounted_products = Product.query.filter_by(is_discounted=True).count()
        
        print("="*60)
        print("✅ اكتمل الـ Seed بنجاح!")
        print("="*60)
        print(f"📊 الإحصائيات:")
        print(f"   - الفئات: {total_categories}")
        print(f"   - المنتجات: {total_products}")
        print(f"   - المنتجات المخفضة: {discounted_products}")
        print("="*60 + "\n")


if __name__ == "__main__":
    main()

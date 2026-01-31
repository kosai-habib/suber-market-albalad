"""
Seed Script محسّن - Market Realism
أسماء بسيطة + صور واقعية من Unsplash
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
        existing = Category.query.filter_by(slug=cat_data["slug"]).first()
        if not existing:
            cat = Category(**cat_data)
            db.session.add(cat)
            print(f"✅ {cat_data['name']}")
    
    db.session.commit()


def seed_realistic_products():
    """منتجات بأسماء بسيطة وصور واقعية"""
    
    categories = {cat.slug: cat for cat in Category.query.all()}
    
    # صور Unsplash بخلفيات بيضاء/خشبية/طبيعية
    products_data = [
        # === Meat & Poultry ===
        {"name": "Chicken Breast", "price": 45.90, "category": "meat", 
         "image_url": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400"},
        
        {"name": "Ground Beef", "price": 52.00, "category": "meat", "is_discounted": True, "discount_percent": 15,
         "image_url": "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400"},
        
        {"name": "Lamb Chops", "price": 89.90, "category": "meat",
         "image_url": "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400"},
        
        {"name": "Turkey", "price": 38.50, "category": "meat",
         "image_url": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400"},
        
        {"name": "Beef Steak", "price": 95.00, "category": "meat", "is_discounted": True, "discount_percent": 10,
         "image_url": "https://images.unsplash.com/photo-1615937691194-98a3d3d9a8b1?w=400"},
        
        {"name": "Chicken Wings", "price": 32.90, "category": "meat",
         "image_url": "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400"},
        
        {"name": "Minced Chicken", "price": 36.00, "category": "meat",
         "image_url": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400"},
        
        # === Dairy & Eggs ===
        {"name": "Milk", "price": 6.90, "category": "dairy",
         "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400"},
        
        {"name": "Greek Yogurt", "price": 12.90, "category": "dairy", "is_discounted": True, "discount_percent": 20,
         "image_url": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400"},
        
        {"name": "Cheddar Cheese", "price": 28.50, "category": "dairy",
         "image_url": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400"},
        
        {"name": "Eggs", "price": 18.90, "category": "dairy",
         "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400"},
        
        {"name": "Butter", "price": 15.90, "category": "dairy",
         "image_url": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400"},
        
        {"name": "Cottage Cheese", "price": 14.50, "category": "dairy", "is_discounted": True, "discount_percent": 15,
         "image_url": "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400"},
        
        {"name": "Cream Cheese", "price": 16.90, "category": "dairy",
         "image_url": "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400"},
        
        # === Fresh Produce ===
        {"name": "Tomatoes", "price": 8.90, "category": "produce",
         "image_url": "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400"},
        
        {"name": "Cucumbers", "price": 6.50, "category": "produce", "is_discounted": True, "discount_percent": 25,
         "image_url": "https://images.unsplash.com/photo-1589621316382-008455b857cd?w=400"},
        
        {"name": "Lettuce", "price": 5.90, "category": "produce",
         "image_url": "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400"},
        
        {"name": "Apples", "price": 12.90, "category": "produce",
         "image_url": "https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb?w=400"},
        
        {"name": "Bananas", "price": 9.90, "category": "produce",
         "image_url": "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400"},
        
        {"name": "Carrots", "price": 7.50, "category": "produce", "is_discounted": True, "discount_percent": 10,
         "image_url": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400"},
        
        {"name": "Bell Peppers", "price": 11.90, "category": "produce",
         "image_url": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400"},
        
        {"name": "Spinach", "price": 8.50, "category": "produce",
         "image_url": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400"},
        
        # === Bakery ===
        {"name": "Bread", "price": 8.90, "category": "bakery",
         "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"},
        
        {"name": "Croissants", "price": 16.90, "category": "bakery", "is_discounted": True, "discount_percent": 20,
         "image_url": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400"},
        
        {"name": "Pita Bread", "price": 6.50, "category": "bakery",
         "image_url": "https://images.unsplash.com/photo-1595777216528-071e0127ccbf?w=400"},
        
        {"name": "Chocolate Cake", "price": 45.00, "category": "bakery",
         "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"},
        
        {"name": "Bagels", "price": 12.90, "category": "bakery",
         "image_url": "https://images.unsplash.com/photo-1551106652-a5bcf4b29e94?w=400"},
        
        {"name": "Dinner Rolls", "price": 9.90, "category": "bakery", "is_discounted": True, "discount_percent": 15,
         "image_url": "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400"},
        
        # === Beverages ===
        {"name": "Orange Juice", "price": 12.90, "category": "beverages",
         "image_url": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400"},
        
        {"name": "Coca Cola", "price": 8.50, "category": "beverages", "is_discounted": True, "discount_percent": 15,
         "image_url": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400"},
        
        {"name": "Water", "price": 15.90, "category": "beverages",
         "image_url": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400"},
        
        {"name": "Apple Juice", "price": 11.90, "category": "beverages",
         "image_url": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400"},
        
        {"name": "Energy Drink", "price": 6.90, "category": "beverages",
         "image_url": "https://images.unsplash.com/photo-1622543925917-763c34f4fdde?w=400"},
        
        {"name": "Iced Tea", "price": 7.50, "category": "beverages", "is_discounted": True, "discount_percent": 10,
         "image_url": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400"},
        
        {"name": "Lemonade", "price": 9.90, "category": "beverages",
         "image_url": "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9f?w=400"},
        
        {"name": "Sparkling Water", "price": 5.50, "category": "beverages",
         "image_url": "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400"},
        
        # === Frozen Foods ===
        {"name": "Pizza", "price": 28.90, "category": "frozen",
         "image_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400"},
        
        {"name": "Ice Cream", "price": 22.90, "category": "frozen", "is_discounted": True, "discount_percent": 25,
         "image_url": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400"},
        
        {"name": "Frozen Vegetables", "price": 16.50, "category": "frozen",
         "image_url": "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400"},
        
        {"name": "Fish Fingers", "price": 32.90, "category": "frozen",
         "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},
        
        {"name": "French Fries", "price": 18.90, "category": "frozen", "is_discounted": True, "discount_percent": 20,
         "image_url": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400"},
        
        {"name": "Frozen Berries", "price": 24.50, "category": "frozen",
         "image_url": "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=400"},
        
        # === Pantry Staples ===
        {"name": "Pasta", "price": 8.90, "category": "pantry",
         "image_url": "https://images.unsplash.com/photo-1551462147-37e00e2eb567?w=400"},
        
        {"name": "Rice", "price": 12.50, "category": "pantry", "is_discounted": True, "discount_percent": 15,
         "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"},
        
        {"name": "Olive Oil", "price": 42.90, "category": "pantry",
         "image_url": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400"},
        
        {"name": "Tomato Sauce", "price": 9.90, "category": "pantry",
         "image_url": "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400"},
        
        {"name": "Honey", "price": 38.50, "category": "pantry",
         "image_url": "https://images.unsplash.com/photo-1587049352846-4a222e784169?w=400"},
        
        {"name": "Flour", "price": 7.50, "category": "pantry", "is_discounted": True, "discount_percent": 10,
         "image_url": "https://images.unsplash.com/photo-1628588680765-f24e6df234b5?w=400"},
        
        {"name": "Sugar", "price": 6.90, "category": "pantry",
         "image_url": "https://images.unsplash.com/photo-1582006788502-90e6e01f07b9?w=400"},
        
        # === Household Items ===
        {"name": "Dish Soap", "price": 12.90, "category": "household",
         "image_url": "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400"},
        
        {"name": "Laundry Detergent", "price": 32.90, "category": "household", "is_discounted": True, "discount_percent": 20,
         "image_url": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400"},
        
        {"name": "Paper Towels", "price": 22.50, "category": "household",
         "image_url": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400"},
        
        {"name": "Toilet Paper", "price": 28.90, "category": "household",
         "image_url": "https://images.unsplash.com/photo-1584556326561-c8c99c06d9ff?w=400"},
        
        {"name": "Sponges", "price": 8.90, "category": "household",
         "image_url": "https://images.unsplash.com/photo-1631540575998-25b3c2b31f66?w=400"},
        
        {"name": "Garbage Bags", "price": 16.50, "category": "household", "is_discounted": True, "discount_percent": 15,
         "image_url": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400"},
    ]
    
    added = 0
    for prod_data in products_data:
        category = categories.get(prod_data.pop("category"))
        if not category:
            continue
        
        existing = Product.query.filter_by(
            name=prod_data["name"], 
            category_id=category.id
        ).first()
        
        if not existing:
            product = Product(**prod_data, category_id=category.id)
            db.session.add(product)
            added += 1
            
            symbol = "🔥" if prod_data.get("is_discounted") else "✅"
            print(f"{symbol} {prod_data['name']}")
    
    db.session.commit()
    print(f"\n✅ أضيف {added} منتج جديد\n")


def main():
    with app.app_context():
        print("\n" + "="*60)
        print("🌱 Seed Database - Market Realism")
        print("="*60 + "\n")
        
        print("📂 الفئات...")
        seed_categories()
        
        print("\n🛒 المنتجات (أسماء بسيطة + صور واقعية)...")
        seed_realistic_products()
        
        total_categories = Category.query.count()
        total_products = Product.query.count()
        discounted = Product.query.filter_by(is_discounted=True).count()
        
        print("="*60)
        print("✅ اكتمل!")
        print("="*60)
        print(f"📊 الإحصائيات:")
        print(f"   - الفئات: {total_categories}")
        print(f"   - المنتجات: {total_products}")
        print(f"   - المنتجات المخفضة: {discounted}")
        print("="*60 + "\n")


if __name__ == "__main__":
    main()

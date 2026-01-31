from app import create_app
from app.extensions import db
from app.models import Category, Product

CATEGORIES_MAP = {
    "fruits-vegetables": {"name": "Fruits & Vegetables", "name_ar": "فواكه وخضروات"},
    "dairy-eggs": {"name": "Dairy & Eggs", "name_ar": "ألبان وبيض"},
    "pantry-canned": {"name": "Pantry & Canned Food", "name_ar": "مخزن ومعلبات"},
    "bakery-bread": {"name": "Bakery & Bread", "name_ar": "مخبز وخبز"},
    "meat-poultry": {"name": "Meat & Poultry", "name_ar": "لحوم ودواجن"},
    "household-cleaning": {"name": "Household & Cleaning", "name_ar": "منظفات ومنزل"},
    "beverages": {"name": "Beverages", "name_ar": "مشروبات"},
    "snacks-sweets": {"name": "Snacks & Sweets", "name_ar": "وجبات خفيفة وحلويات"},
    "ready-to-eat-foods": {"name": "Ready to Eat Foods", "name_ar": "أطعمة جاهزة"},
    "frozen-foods": {"name": "Frozen Foods", "name_ar": "مجمدات"},
}

PRODUCTS_DATA = [
    # FRUITS & VEGETABLES
    {
        "name": "Fresh Tomatoes",
        "name_ar": "طماطم طازجة",
        "price": 3.50,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Fresh, ripe tomatoes perfect for salads and cooking.",
        "stock": 150,
        "img": "/images/products/tomato.png"
    },
    {
        "name": "Fresh Apples",
        "name_ar": "تفاح طازج",
        "price": 8.90,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Crisp and sweet apples, perfect for snacking.",
        "stock": 200,
        "img": "/images/products/apple.png"
    },
    {
        "name": "Bananas",
        "name_ar": "موز",
        "price": 6.50,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Fresh bananas, rich in potassium.",
        "stock": 180,
        "img": "/images/products/banana.png"
    },
    {
        "name": "Green Grapes",
        "name_ar": "عنب أخضر",
        "price": 12.90,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Sweet seedless green grapes.",
        "stock": 100,
        "img": "/images/products/green grapes.png"
    },
    {
        "name": "Blue Grapes",
        "name_ar": "عنب أزرق",
        "price": 14.90,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Sweet blue grapes, rich in antioxidants.",
        "stock": 90,
        "img": "/images/products/blue grapes.png"
    },
    {
        "name": "Watermelon",
        "name_ar": "بطيخ",
        "price": 4.50,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Refreshing watermelon, perfect for summer.",
        "stock": 50,
        "img": "/images/products/watermelon.png"
    },
    {
        "name": "Strawberries",
        "name_ar": "فراولة",
        "price": 15.90,
        "cat": "fruits-vegetables",
        "unit": "per 500g",
        "description": "Fresh sweet strawberries.",
        "stock": 80,
        "img": "/images/products/strawberry.png"
    },
    {
        "name": "Oranges",
        "name_ar": "برتقال",
        "price": 7.50,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Juicy oranges, high in vitamin C.",
        "stock": 150,
        "img": "/images/products/orange.png"
    },
    {
        "name": "Lichi (Lychee)",
        "name_ar": "ليتشي",
        "price": 25.90,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Exotic lychee fruit, sweet and aromatic.",
        "stock": 40,
        "img": "/images/products/lichi.png"
    },
    {
        "name": "Red Bell Peppers",
        "name_ar": "فلفل رومي أحمر",
        "price": 6.90,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Sweet red bell peppers, rich in vitamin C.",
        "stock": 80,
        "img": "/images/products/red papper.png"
    },
    {
        "name": "Green Capsicum",
        "name_ar": "فليفلة خضراء",
        "price": 5.50,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Fresh green capsicum for cooking.",
        "stock": 100,
        "img": "/images/products/capsicum.png"
    },
    {
        "name": "Carrots",
        "name_ar": "جزر",
        "price": 3.90,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Fresh carrots, rich in beta-carotene.",
        "stock": 150,
        "img": "/images/products/carrot.png"
    },
    {
        "name": "Broccoli",
        "name_ar": "بروكلي",
        "price": 8.50,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Fresh broccoli, packed with nutrients.",
        "stock": 70,
        "img": "/images/products/broccoli.png"
    },
    {
        "name": "Cauliflower",
        "name_ar": "قرنبيط",
        "price": 7.90,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Fresh cauliflower, versatile vegetable.",
        "stock": 80,
        "img": "/images/products/cauliflower.png"
    },
    {
        "name": "White Cabbage",
        "name_ar": "ملفوف أبيض",
        "price": 3.90,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Crispy white cabbage for salads.",
        "stock": 90,
        "img": "/images/products/cabbage.png"
    },

    # MEAT & POULTRY
    {
        "name": "Fresh Chicken",
        "name_ar": "دجاج طازج",
        "price": 28.90,
        "cat": "meat-poultry",
        "unit": "per kg",
        "description": "Fresh whole chicken, perfect for roasting.",
        "stock": 60,
        "img": "/images/products/chicken.png"
    },
    {
        "name": "Chicken Leg Pieces",
        "name_ar": "قطع أفخاذ دجاج",
        "price": 32.90,
        "cat": "meat-poultry",
        "unit": "per kg",
        "description": "Fresh chicken leg pieces, juicy and tender.",
        "stock": 70,
        "img": "/images/products/chicken leg pieces.png"
    },
    {
        "name": "Beef Steak",
        "name_ar": "ستيك لحم بقري",
        "price": 55.90,
        "cat": "meat-poultry",
        "unit": "per kg",
        "description": "Premium beef steak, perfect for grilling.",
        "stock": 40,
        "img": "/images/products/beaf steak.png"
    },
    {
        "name": "Salmon Fish",
        "name_ar": "سمك سلمون",
        "price": 68.90,
        "cat": "meat-poultry",
        "unit": "per kg",
        "description": "Fresh salmon, rich in omega-3.",
        "stock": 30,
        "img": "/images/products/salmon fish.png"
    },
    {
        "name": "Oily Fish",
        "name_ar": "سمك زيتي",
        "price": 42.90,
        "cat": "meat-poultry",
        "unit": "per kg",
        "description": "Fresh oily fish, healthy and nutritious.",
        "stock": 50,
        "img": "/images/products/oily fishes.png"
    },

    # OTHER CATEGORIES
    {
        "name": "Fresh Milk",
        "name_ar": "حليب طازج",
        "price": 4.50,
        "cat": "dairy-eggs",
        "unit": "1L",
        "description": "Full fat fresh milk, pasteurized.",
        "stock": 200,
        "img": "https://images.unsplash.com/photo-1563636619-e9107da8a7aa?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "White Bread",
        "name_ar": "خبز أبيض",
        "price": 4.50,
        "cat": "bakery-bread",
        "unit": "per loaf",
        "description": "Fresh soft white bread.",
        "stock": 180,
        "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Mineral Water",
        "name_ar": "ماء معدني",
        "price": 3.50,
        "cat": "beverages",
        "unit": "1.5L",
        "description": "Pure mineral water.",
        "stock": 300,
        "img": "https://images.unsplash.com/photo-1559839914-17aae19cea0e?auto=format&fit=crop&q=80&w=800"
    },
]


def clear_data():
    print("🗑️  Clearing existing data...")
    try:
        Product.query.delete()
        Category.query.delete()
        db.session.commit()
        print("✅ Data cleared!")
    except Exception as e:
        print(f"⚠️  No existing data to clear (tables may not exist yet): {e}")


def seed_categories():
    print("\n📁 Seeding categories...")
    cat_id_map = {}
    
    for slug, cat_data in CATEGORIES_MAP.items():
        cat = Category(slug=slug, name=cat_data["name"])
        db.session.add(cat)
        db.session.flush()
        cat_id_map[slug] = cat.id
        print(f"  ✅ {cat_data['name']}")
    
    db.session.commit()
    return cat_id_map


def seed_products(cat_id_map):
    print("\n📦 Seeding products...")
    
    for p_data in PRODUCTS_DATA:
        product = Product(
            name=p_data["name"],
            price=p_data["price"],
            image_url=p_data["img"],
            category_id=cat_id_map[p_data["cat"]],
            unit=p_data.get("unit"),
            badge=p_data.get("badge")
        )
        db.session.add(product)
        print(f"  ✅ {p_data['name']}")
    
    db.session.commit()


def seed_data():
    print("=" * 80)
    print("🌱 STARTING DATABASE SEED")
    print("=" * 80)
    
    clear_data()
    cat_id_map = seed_categories()
    seed_products(cat_id_map)
    
    print("\n" + "=" * 80)
    print("✅ SEED COMPLETED SUCCESSFULLY!")
    print(f"📊 Total Categories: {len(CATEGORIES_MAP)}")
    print(f"📦 Total Products: {len(PRODUCTS_DATA)}")
    print("=" * 80)


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        seed_data()

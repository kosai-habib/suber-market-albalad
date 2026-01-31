from app import create_app
from app.extensions import db
from app.models import Category, Product

# ============================================================================
# ENHANCED SEED FILE - نسخة محسّنة بالكامل
# ============================================================================

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

# ============================================================================
# PRODUCTS DATA - بيانات كاملة محسّنة
# ============================================================================

PRODUCTS_DATA = [
    # ========== FRUITS & VEGETABLES ==========
    {
        "name": "Fresh Tomatoes",
        "name_ar": "طماطم طازجة",
        "price": 3.50,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Fresh, ripe tomatoes perfect for salads and cooking. Rich in vitamins and antioxidants.",
        "description_ar": "طماطم طازجة ناضجة مثالية للسلطات والطبخ. غنية بالفيتامينات ومضادات الأكسدة.",
        "brand": "Fresh Farms",
        "weight": "1 kg",
        "stock": 150,
        "sku": "VEG-TOM-001",
        "rating": 4.5,
        "reviews": 48,
        "tags": "fresh,organic,local",
        "img": "/images/products/tomato.png"
    },
    {
        "name": "Cucumbers",
        "name_ar": "خيار",
        "price": 2.50,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Crisp and fresh cucumbers, perfect for salads and snacks.",
        "description_ar": "خيار طازج ومقرمش، مثالي للسلطات والوجبات الخفيفة.",
        "brand": "Fresh Farms",
        "weight": "1 kg",
        "stock": 200,
        "sku": "VEG-CUC-001",
        "rating": 4.3,
        "reviews": 35,
        "tags": "fresh,crunchy",
        "img": "https://images.unsplash.com/photo-1449300079323-02e209d9d02d?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Red Bell Peppers",
        "name_ar": "فلفل رومي أحمر",
        "price": 6.90,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Sweet red bell peppers, rich in vitamin C. Great for grilling and salads.",
        "description_ar": "فلفل رومي أحمر حلو، غني بفيتامين سي. رائع للشوي والسلطات.",
        "brand": "Fresh Farms",
        "weight": "1 kg",
        "stock": 80,
        "sku": "VEG-PEP-001",
        "rating": 4.7,
        "reviews": 52,
        "tags": "fresh,sweet,vitamin-c",
        "img": "/images/products/red papper.png"
    },
    {
        "name": "Potatoes",
        "name_ar": "بطاطس",
        "price": 2.20,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Fresh potatoes perfect for frying, baking, or mashing.",
        "description_ar": "بطاطس طازجة مثالية للقلي أو الخبز أو الهرس.",
        "brand": "Farm Fresh",
        "weight": "1 kg",
        "stock": 300,
        "sku": "VEG-POT-001",
        "rating": 4.4,
        "reviews": 89,
        "tags": "staple,versatile",
        "img": "https://images.unsplash.com/photo-1518977676601-b53f02bad675?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "White Onions",
        "name_ar": "بصل أبيض",
        "price": 2.90,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Fresh white onions, essential for every kitchen.",
        "description_ar": "بصل أبيض طازج، أساسي لكل مطبخ.",
        "brand": "Local Farms",
        "weight": "1 kg",
        "stock": 250,
        "sku": "VEG-ONI-001",
        "rating": 4.2,
        "reviews": 67,
        "tags": "essential,cooking",
        "img": "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Fresh Parsley",
        "name_ar": "بقدونس طازج",
        "price": 3.90,
        "cat": "fruits-vegetables",
        "unit": "per bunch",
        "description": "Fresh green parsley, perfect for garnishing and cooking.",
        "description_ar": "بقدونس أخضر طازج، مثالي للتزيين والطبخ.",
        "brand": "Herb Garden",
        "weight": "100g",
        "stock": 120,
        "sku": "HRB-PAR-001",
        "rating": 4.6,
        "reviews": 34,
        "tags": "fresh,herbs,aromatic",
        "img": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "White Cabbage",
        "name_ar": "ملفوف أبيض",
        "price": 3.90,
        "cat": "fruits-vegetables",
        "unit": "per kg",
        "description": "Crispy white cabbage, great for coleslaw and stir-fries.",
        "description_ar": "ملفوف أبيض مقرمش، رائع للسلطة والمقليات.",
        "brand": "Fresh Farms",
        "weight": "1 kg",
        "stock": 90,
        "sku": "VEG-CAB-001",
        "rating": 4.1,
        "reviews": 28,
        "tags": "crunchy,healthy",
        "img": "/images/products/cabbage.png"
    },

    # ========== DAIRY & EGGS ==========
    {
        "name": "Organic Eggs",
        "name_ar": "بيض عضوي",
        "price": 5.99,
        "cat": "dairy-eggs",
        "unit": "per dozen",
        "badge": "12 pcs",
        "description": "Fresh organic eggs from free-range hens. Rich in protein and omega-3.",
        "description_ar": "بيض عضوي طازج من دجاج حر. غني بالبروتين وأوميغا 3.",
        "brand": "Happy Hens",
        "weight": "12 eggs",
        "stock": 100,
        "sku": "DAI-EGG-001",
        "rating": 4.8,
        "reviews": 156,
        "tags": "organic,protein,omega-3",
        "img": "https://images.unsplash.com/photo-1582722872445-44c56bb6274a?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Fresh Milk",
        "name_ar": "حليب طازج",
        "price": 4.50,
        "cat": "dairy-eggs",
        "unit": "1L",
        "description": "Full fat fresh milk, pasteurized and homogenized.",
        "description_ar": "حليب طازج كامل الدسم، مبستر ومتجانس.",
        "brand": "Tnuva",
        "weight": "1 Liter",
        "stock": 200,
        "sku": "DAI-MLK-001",
        "rating": 4.7,
        "reviews": 234,
        "tags": "fresh,calcium,dairy",
        "img": "https://images.unsplash.com/photo-1563636619-e9107da8a7aa?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "White Cheese",
        "name_ar": "جبنة بيضاء",
        "price": 12.90,
        "cat": "dairy-eggs",
        "unit": "250g",
        "description": "Creamy white cheese, perfect for breakfast and sandwiches.",
        "description_ar": "جبنة بيضاء كريمية، مثالية للإفطار والسندويشات.",
        "brand": "Gad",
        "weight": "250g",
        "stock": 150,
        "sku": "DAI-CHE-001",
        "rating": 4.6,
        "reviews": 98,
        "tags": "creamy,breakfast",
        "img": "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Greek Yogurt",
        "name_ar": "زبادي يوناني",
        "price": 8.50,
        "cat": "dairy-eggs",
        "unit": "500g",
        "description": "Thick and creamy Greek yogurt, high in protein.",
        "description_ar": "زبادي يوناني سميك وكريمي، غني بالبروتين.",
        "brand": "Strauss",
        "weight": "500g",
        "stock": 120,
        "sku": "DAI-YOG-001",
        "rating": 4.9,
        "reviews": 187,
        "tags": "protein,healthy,probiotic",
        "img": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800"
    },

    # ========== BAKERY & BREAD ==========
    {
        "name": "White Bread",
        "name_ar": "خبز أبيض",
        "price": 4.50,
        "cat": "bakery-bread",
        "unit": "per loaf",
        "description": "Fresh soft white bread, perfect for sandwiches.",
        "description_ar": "خبز أبيض طازج وطري، مثالي للسندويشات.",
        "brand": "Angel Bakery",
        "weight": "750g",
        "stock": 180,
        "sku": "BAK-BRD-001",
        "rating": 4.4,
        "reviews": 145,
        "tags": "fresh,soft,daily",
        "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Whole Wheat Bread",
        "name_ar": "خبز قمح كامل",
        "price": 5.50,
        "cat": "bakery-bread",
        "unit": "per loaf",
        "description": "Healthy whole wheat bread, high in fiber.",
        "description_ar": "خبز قمح كامل صحي، غني بالألياف.",
        "brand": "Angel Bakery",
        "weight": "750g",
        "stock": 150,
        "sku": "BAK-BRD-002",
        "rating": 4.6,
        "reviews": 123,
        "tags": "healthy,fiber,wholegrain",
        "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Pita Bread",
        "name_ar": "خبز عربي",
        "price": 3.50,
        "cat": "bakery-bread",
        "unit": "6 pcs",
        "badge": "6 pcs",
        "description": "Traditional pita bread, perfect for falafel and shawarma.",
        "description_ar": "خبز عربي تقليدي، مثالي للفلافل والشاورما.",
        "brand": "Local Bakery",
        "weight": "6 pieces",
        "stock": 200,
        "sku": "BAK-PIT-001",
        "rating": 4.8,
        "reviews": 267,
        "tags": "traditional,middle-eastern",
        "img": "https://images.unsplash.com/photo-1586444248902-2f64eddf13cf?auto=format&fit=crop&q=80&w=800"
    },

    # ========== MEAT & POULTRY ==========
    {
        "name": "Fresh Chicken Breast",
        "name_ar": "صدور دجاج طازجة",
        "price": 32.90,
        "cat": "meat-poultry",
        "unit": "per kg",
        "description": "Fresh boneless chicken breast, lean protein source.",
        "description_ar": "صدور دجاج طازجة بدون عظم، مصدر بروتين خالي من الدهون.",
        "brand": "Oaf Tov",
        "weight": "1 kg",
        "stock": 80,
        "sku": "MEA-CHI-001",
        "rating": 4.7,
        "reviews": 156,
        "tags": "protein,lean,fresh",
        "img": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Ground Beef",
        "name_ar": "لحم بقري مفروم",
        "price": 45.90,
        "cat": "meat-poultry",
        "unit": "per kg",
        "description": "Fresh ground beef, perfect for burgers and meatballs.",
        "description_ar": "لحم بقري مفروم طازج، مثالي للبرغر وكرات اللحم.",
        "brand": "Premium Meats",
        "weight": "1 kg",
        "stock": 60,
        "sku": "MEA-BEE-001",
        "rating": 4.5,
        "reviews": 89,
        "tags": "beef,protein,versatile",
        "img": "https://images.unsplash.com/photo-1588168333986-507efd3ae3e5?auto=format&fit=crop&q=80&w=800"
    },

    # ========== READY TO EAT ==========
    {
        "name": "Beef Nuggets",
        "name_ar": "ناجتس لحم بقري",
        "price": 35.90,
        "cat": "ready-to-eat-foods",
        "unit": "600g",
        "description": "Crispy beef nuggets, ready to cook in minutes.",
        "description_ar": "ناجتس لحم بقري مقرمش، جاهز للطهي في دقائق.",
        "brand": "Oaf Tov",
        "weight": "600g",
        "stock": 70,
        "sku": "RTE-NUG-001",
        "rating": 4.3,
        "reviews": 78,
        "tags": "quick,easy,kids-favorite",
        "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Beef Patties",
        "name_ar": "فطائر لحم بقري",
        "price": 39.90,
        "cat": "ready-to-eat-foods",
        "unit": "500g",
        "description": "Juicy beef patties, perfect for burgers.",
        "description_ar": "فطائر لحم بقري شهية، مثالية للبرغر.",
        "brand": "Oaf Tov",
        "weight": "500g",
        "stock": 50,
        "sku": "RTE-PAT-001",
        "rating": 4.4,
        "reviews": 92,
        "tags": "burger,grill,bbq",
        "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
    },

    # ========== BEVERAGES ==========
    {
        "name": "Fresh Orange Juice",
        "name_ar": "عصير برتقال طازج",
        "price": 12.90,
        "cat": "beverages",
        "unit": "1L",
        "description": "Freshly squeezed orange juice, no added sugar.",
        "description_ar": "عصير برتقال طازج معصور، بدون سكر مضاف.",
        "brand": "Tropicana",
        "weight": "1 Liter",
        "stock": 100,
        "sku": "BEV-JUI-001",
        "rating": 4.7,
        "reviews": 145,
        "tags": "fresh,vitamin-c,healthy",
        "img": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Mineral Water",
        "name_ar": "ماء معدني",
        "price": 3.50,
        "cat": "beverages",
        "unit": "1.5L",
        "description": "Pure mineral water, naturally filtered.",
        "description_ar": "ماء معدني نقي، مفلتر طبيعياً.",
        "brand": "Neviot",
        "weight": "1.5 Liter",
        "stock": 300,
        "sku": "BEV-WAT-001",
        "rating": 4.5,
        "reviews": 234,
        "tags": "pure,hydration,essential",
        "img": "https://images.unsplash.com/photo-1559839914-17aae19cea0e?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Cola",
        "name_ar": "كولا",
        "price": 5.90,
        "cat": "beverages",
        "unit": "1.5L",
        "description": "Classic cola soft drink, refreshing and fizzy.",
        "description_ar": "مشروب كولا كلاسيكي، منعش وغازي.",
        "brand": "Coca-Cola",
        "weight": "1.5 Liter",
        "stock": 200,
        "sku": "BEV-COL-001",
        "rating": 4.3,
        "reviews": 189,
        "tags": "fizzy,refreshing,classic",
        "img": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800"
    },

    # ========== SNACKS & SWEETS ==========
    {
        "name": "Potato Chips - Classic",
        "name_ar": "شيبس بطاطس - كلاسيك",
        "price": 8.90,
        "cat": "snacks-sweets",
        "unit": "200g",
        "description": "Crispy potato chips with classic salt flavor.",
        "description_ar": "رقائق بطاطس مقرمشة بنكهة الملح الكلاسيكية.",
        "brand": "Tapuchips",
        "weight": "200g",
        "stock": 150,
        "sku": "SNK-CHP-001",
        "rating": 4.5,
        "reviews": 267,
        "tags": "crispy,snack,favorite",
        "img": "https://images.unsplash.com/photo-1566478431375-707a62544e53?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Chocolate Bar",
        "name_ar": "لوح شوكولاتة",
        "price": 6.50,
        "cat": "snacks-sweets",
        "unit": "100g",
        "description": "Smooth milk chocolate bar, perfect for sweet cravings.",
        "description_ar": "لوح شوكولاتة بالحليب ناعم، مثالي للرغبة الشديدة في الحلويات.",
        "brand": "Elite",
        "weight": "100g",
        "stock": 200,
        "sku": "SNK-CHO-001",
        "rating": 4.8,
        "reviews": 345,
        "tags": "sweet,chocolate,treat",
        "img": "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=800"
    },

    # ========== HOUSEHOLD & CLEANING ==========
    {
        "name": "Dish Soap",
        "name_ar": "صابون أطباق",
        "price": 9.90,
        "cat": "household-cleaning",
        "unit": "750ml",
        "description": "Effective dish soap, cuts through grease easily.",
        "description_ar": "صابون أطباق فعال، يزيل الدهون بسهولة.",
        "brand": "Fairy",
        "weight": "750ml",
        "stock": 180,
        "sku": "HSE-DSH-001",
        "rating": 4.6,
        "reviews": 145,
        "tags": "cleaning,grease,dishes",
        "img": "https://images.unsplash.com/photo-1585675100414-add2e465a136?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Laundry Detergent",
        "name_ar": "مسحوق غسيل",
        "price": 32.90,
        "cat": "household-cleaning",
        "unit": "3L",
        "description": "Powerful laundry detergent for fresh and clean clothes.",
        "description_ar": "مسحوق غسيل قوي لملابس نظيفة ومنعشة.",
        "brand": "Ariel",
        "weight": "3 Liters",
        "stock": 100,
        "sku": "HSE-LAU-001",
        "rating": 4.7,
        "reviews": 189,
        "tags": "cleaning,laundry,powerful",
        "img": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=800"
    },
]


def clear_data():
    """مسح جميع البيانات من قاعدة البيانات"""
    print("🗑️  Clearing existing data...")
    Product.query.delete()
    Category.query.delete()
    db.session.commit()
    print("✅ Data cleared!")


def seed_categories():
    """إضافة الفئات"""
    print("\n📁 Seeding categories...")
    cat_id_map = {}
    
    for slug, cat_data in CATEGORIES_MAP.items():
        cat = Category(
            slug=slug,
            name=cat_data["name"]
            # إذا كان لديك name_ar في الـ model، أضفه هنا:
            # name_ar=cat_data["name_ar"]
        )
        db.session.add(cat)
        db.session.flush()  # للحصول على الـ ID
        cat_id_map[slug] = cat.id
        print(f"  ✅ {cat_data['name']} ({cat_data['name_ar']})")
    
    db.session.commit()
    return cat_id_map


def seed_products(cat_id_map):
    """إضافة المنتجات"""
    print("\n📦 Seeding products...")
    
    for p_data in PRODUCTS_DATA:
        product = Product(
            name=p_data["name"],
            # name_ar=p_data.get("name_ar"),  # أضف إذا موجود في الـ model
            price=p_data["price"],
            image_url=p_data["img"],
            category_id=cat_id_map[p_data["cat"]],
            unit=p_data.get("unit"),
            badge=p_data.get("badge"),
            # description=p_data.get("description"),  # أضف إذا موجود
            # description_ar=p_data.get("description_ar"),  # أضف إذا موجود
            # brand=p_data.get("brand"),  # أضف إذا موجود
            # weight=p_data.get("weight"),  # أضف إذا موجود
            # stock_quantity=p_data.get("stock", 100),  # أضف إذا موجود
            # sku=p_data.get("sku"),  # أضف إذا موجود
            # rating=p_data.get("rating", 0.0),  # أضف إذا موجود
            # reviews_count=p_data.get("reviews", 0),  # أضف إذا موجود
            # tags=p_data.get("tags"),  # أضف إذا موجود
        )
        db.session.add(product)
        print(f"  ✅ {p_data['name']} ({p_data.get('name_ar', 'N/A')})")
    
    db.session.commit()


def seed_data():
    """الوظيفة الرئيسية للـ seeding"""
    print("=" * 80)
    print("🌱 STARTING DATABASE SEED")
    print("=" * 80)
    
    # مسح البيانات القديمة
    clear_data()
    
    # إضافة الفئات
    cat_id_map = seed_categories()
    
    # إضافة المنتجات
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
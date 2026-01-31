from app import create_app
from app.extensions import db
from app.models import Category, Product

# master mapping for categories with visual concepts
CATEGORIES_DATA = {
    "fruits-vegetables": {
        "name": "Fruits & Vegetables", 
        "img": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
    },
    "dairy-eggs": {
        "name": "Dairy & Eggs", 
        "img": "https://images.unsplash.com/photo-1563636619-e9107da8a7aa?auto=format&fit=crop&q=80&w=800"
    },
    "pantry-canned": {
        "name": "Pantry & Canned Food", 
        "img": "https://images.unsplash.com/photo-1590779033100-9f60af05a013?auto=format&fit=crop&q=80&w=800"
    },
    "bakery-bread": {
        "name": "Bakery & Bread", 
        "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"
    },
    "meat-poultry": {
        "name": "Meat & Poultry", 
        "img": "https://images.unsplash.com/photo-1588168333986-507efd3ae3e5?auto=format&fit=crop&q=80&w=800"
    },
    "household-cleaning": {
        "name": "Household & Cleaning", 
        "img": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"
    },
    "beverages": {
        "name": "Beverages", 
        "img": "https://images.unsplash.com/photo-1559839914-17aae19cea0e?auto=format&fit=crop&q=80&w=800"
    },
    "snacks-sweets": {
        "name": "Snacks & Sweets", 
        "img": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=800"
    },
    "ready-to-eat-foods": {
        "name": "Ready to Eat Foods", 
        "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
    },
    "body-face-care": {
        "name": "Body & Face Care", 
        "img": "https://images.unsplash.com/photo-1556228515-919530a0867a?auto=format&fit=crop&q=80&w=800"
    },
    "deli-salads-cold-cuts": {
        "name": "Deli, Salads & Cold Cuts", 
        "img": "https://images.unsplash.com/photo-1540914129282-629bb4b29e3a?auto=format&fit=crop&q=80&w=800"
    },
    "plant-based-products": {
        "name": "Plant-Based Products", 
        "img": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
    },
    "dairy-substitutes": {
        "name": "Dairy Substitutes", 
        "img": "https://images.unsplash.com/photo-1550583724-1d55d04adcb1?auto=format&fit=crop&q=80&w=800"
    },
    "ice-cream": {
        "name": "Ice Cream", 
        "img": "https://images.unsplash.com/photo-1501443762214-6f05bb541fb7?auto=format&fit=crop&q=80&w=800"
    }
}

PRODUCTS_LIST = [
    # Fruits & Vegetables (16+)
    {"name": "Organic Red Apples", "cat": "fruits-vegetables", "price": 12.00, "unit": "per kg", "badge": "1kg", "img": "https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb"},
    {"name": "Fresh Bananas", "cat": "fruits-vegetables", "price": 6.50, "unit": "per bunch", "badge": "", "img": "https://images.unsplash.com/photo-1603833665858-e61d17a86224"},
    {"name": "Hass Avocado (Pre-ripened)", "cat": "fruits-vegetables", "price": 8.00, "unit": "per unit", "badge": "Premium", "img": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578"},
    {"name": "Baby Spinach (Washed)", "cat": "fruits-vegetables", "price": 11.00, "unit": "200g bag", "badge": "Organic", "img": "https://images.unsplash.com/photo-1576045057995-568f588f82fb"},
    {"name": "Vine-Ripened Cherry Tomatoes", "cat": "fruits-vegetables", "price": 6.90, "unit": "per 500g", "badge": "Local", "img": "https://images.unsplash.com/photo-1561132044-67d71d9d959b"},
    {"name": "Fresh Lemon", "cat": "fruits-vegetables", "price": 1.50, "unit": "per unit", "badge": "Fresh", "img": "https://images.unsplash.com/photo-1590502593747-42a996133562"},
    {"name": "English Cucumbers", "cat": "fruits-vegetables", "price": 4.50, "unit": "per 1kg", "badge": "Crunchy", "img": "https://images.unsplash.com/photo-1449300079323-02e209d9d02d"},
    {"name": "White Table Onions", "cat": "fruits-vegetables", "price": 3.40, "unit": "per 1kg", "badge": "Essential", "img": "https://images.unsplash.com/photo-1508747703725-719777637510"},
    {"name": "Sweet Red Potatoes", "cat": "fruits-vegetables", "price": 4.20, "unit": "per 1kg", "badge": "1kg", "img": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d"},
    {"name": "Fresh Broccoli Head", "cat": "fruits-vegetables", "price": 9.50, "unit": "per unit", "badge": "Vitamin C", "img": "https://images.unsplash.com/photo-1452948491233-ad8a1ed01085"},
    {"name": "Crunchy Carrots", "cat": "fruits-vegetables", "price": 3.90, "unit": "per 1kg", "badge": "Sweet", "img": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37"},
    {"name": "Garden Parsley", "cat": "fruits-vegetables", "price": 3.90, "unit": "per bunch", "badge": "Local", "img": "https://images.unsplash.com/photo-1542838132-92c53300491e"},
    {"name": "Blueberry Box (Imported)", "cat": "fruits-vegetables", "price": 18.00, "unit": "125g pack", "badge": "Superfood", "img": "https://images.unsplash.com/photo-1498557850523-fd3d118b962e"},
    {"name": "Honeydew Strawberry", "cat": "fruits-vegetables", "price": 15.00, "unit": "250g pack", "badge": "Seasonal", "img": "https://images.unsplash.com/photo-1464960726346-64bc42632420"},
    {"name": "Fresh Garlic Bulbs", "cat": "fruits-vegetables", "price": 5.00, "unit": "3pk", "badge": "Flavor", "img": "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383"},
    {"name": "Iceberg Lettuce", "cat": "fruits-vegetables", "price": 5.20, "unit": "per unit", "badge": "", "img": "https://images.unsplash.com/photo-1622206141842-8395f1fa684d"},

    # Dairy & Eggs
    {"name": "Organic Large Eggs", "cat": "dairy-eggs", "price": 5.99, "unit": "per dozen", "badge": "12 pcs", "img": "https://images.unsplash.com/photo-1582722872445-44c56bb6274a"},
    {"name": "Full Cream Milk", "cat": "dairy-eggs", "price": 6.50, "unit": "1L Carton", "badge": "Essential", "img": "https://images.unsplash.com/photo-1563636619-e9107da8a7aa"},
    {"name": "Greek Style Yogurt (Plain)", "cat": "dairy-eggs", "price": 14.50, "unit": "500g", "badge": "10% Fat", "img": "https://images.unsplash.com/photo-1488477181946-6428a0291777"},
    {"name": "Traditional White Labneh", "cat": "dairy-eggs", "price": 12.00, "unit": "400g", "badge": "Local", "img": "https://images.unsplash.com/photo-1635436338433-89747d0ca0ef"},
    {"name": "Salted Butter Block", "cat": "dairy-eggs", "price": 12.50, "unit": "200g", "badge": "Classic", "img": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d"},
    {"name": "Sharp Cheddar Cheese", "cat": "dairy-eggs", "price": 22.00, "unit": "250g", "badge": "Aged", "img": "https://images.unsplash.com/photo-1618164435735-413d3b066c9a"},
    {"name": "Mozzarella Shreds", "cat": "dairy-eggs", "price": 18.00, "unit": "200g", "badge": "", "img": "https://images.unsplash.com/photo-1552767059-ce182ead6c1b"},
    {"name": "Soft Cream Cheese", "cat": "dairy-eggs", "price": 13.50, "unit": "200g", "badge": "Spread", "img": "https://images.unsplash.com/photo-1552767059-ce182ead6c1b"},
    {"name": "Low Fat Milk (1%)", "cat": "dairy-eggs", "price": 6.50, "unit": "1L Carton", "badge": "Light", "img": "https://images.unsplash.com/photo-1550583724-1d55d04adcb1"},
    {"name": "Natural Drinking Yogurt", "cat": "dairy-eggs", "price": 5.50, "unit": "330ml", "badge": "On-the-go", "img": "https://images.unsplash.com/photo-1488477181946-6428a0291777"},

    # Pantry & Canned Food
    {"name": "Premium Basmati Rice", "cat": "pantry-canned", "price": 15.00, "unit": "1kg", "badge": "Long Grain", "img": "https://images.unsplash.com/photo-1586201375761-83865001e31c"},
    {"name": "Artisan Spaghetti Pasta", "cat": "pantry-canned", "price": 5.50, "unit": "500g", "badge": "Durum Wheat", "img": "https://images.unsplash.com/photo-1551462147-3a88588d4a3f"},
    {"name": "Extra Virgin Olive Oil", "cat": "pantry-canned", "price": 32.00, "unit": "500ml", "badge": "Cold Pressed", "img": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5"},
    {"name": "Solid Light Tuna in Oil", "cat": "pantry-canned", "price": 7.50, "unit": "160g", "badge": "Premium", "img": "https://images.unsplash.com/photo-1627429184511-1379374092b7"},
    {"name": "Concentrated Tomato Paste", "cat": "pantry-canned", "price": 3.80, "unit": "400g", "badge": "100% Natural", "img": "https://images.unsplash.com/photo-1590779033100-9f60af05a013"},
    {"name": "Organic Red Lentils", "cat": "pantry-canned", "price": 8.50, "unit": "1kg", "badge": "High Protein", "img": "https://images.unsplash.com/photo-1521997017042-4f3df7a76c8c"},
    {"name": "Canned Garbanzo Beans", "cat": "pantry-canned", "price": 4.50, "unit": "400g", "badge": "Pantry Staple", "img": "https://images.unsplash.com/photo-1547514701-42782101795e"},
    {"name": "Classic Tomato Sauce", "cat": "pantry-canned", "price": 8.00, "unit": "500g", "badge": "Base", "img": "https://images.unsplash.com/photo-1590779033100-9f60af05a013"},

    # Bakery & Bread
    {"name": "Traditional Arabic Pita", "cat": "bakery-bread", "price": 4.50, "unit": "5pk", "badge": "Stone Baked", "img": "https://images.unsplash.com/photo-1586444248902-2f64eddf13cf"},
    {"name": "Artisan Sourdough Loaf", "cat": "bakery-bread", "price": 12.00, "unit": "per unit", "badge": "Freshly Baked", "img": "https://images.unsplash.com/photo-1585478259715-876a6a81bce8"},
    {"name": "French Baguette (Classic)", "cat": "bakery-bread", "price": 5.00, "unit": "per unit", "badge": "Crunchy", "img": "https://images.unsplash.com/photo-1586444248902-2f64eddf13cf"},
    {"name": "Buttery Croissant", "cat": "bakery-bread", "price": 4.50, "unit": "per unit", "badge": "French Style", "img": "https://images.unsplash.com/photo-1555507036-ab1f4038808a"},
    {"name": "Soft Whole Wheat Bread", "cat": "bakery-bread", "price": 8.00, "unit": "750g", "badge": "High Fiber", "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff"},
    {"name": "Brioche Burger Buns", "cat": "bakery-bread", "price": 9.00, "unit": "4pk", "badge": "Soft", "img": "https://images.unsplash.com/photo-1585145062885-472ba218633b"},

    # Meat & Poultry
    {"name": "Premium Chicken Breast", "cat": "meat-poultry", "price": 38.00, "unit": "1kg pack", "badge": "Local", "img": "https://images.unsplash.com/photo-1627440221370-98565b93226a"},
    {"name": "Lean Ground Beef", "cat": "meat-poultry", "price": 45.00, "unit": "1kg pack", "badge": "Premium", "img": "https://images.unsplash.com/photo-1588168333986-507efd3ae3e5"},
    {"name": "Prime Ribeye Steak", "cat": "meat-poultry", "price": 120.00, "unit": "per kg", "badge": "Marble Grade", "img": "https://images.unsplash.com/photo-1603048588665-791ca8aea617"},
    {"name": "Fresh Whole Chicken", "cat": "meat-poultry", "price": 28.00, "unit": "per unit", "badge": "Family size", "img": "https://images.unsplash.com/photo-1587593810167-a84920ea0781"},
    {"name": "Gourmet Beef Patties", "cat": "meat-poultry", "price": 35.00, "unit": "4pk", "badge": "Grill Ready", "img": "https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f6"},

    # Beverages
    {"name": "Mineral Water (Still)", "cat": "beverages", "price": 2.50, "unit": "1.5L", "badge": "Pure", "img": "https://images.unsplash.com/photo-1559839914-17aae19cea0e"},
    {"name": "Sparkling Mineral Water", "cat": "beverages", "price": 5.00, "unit": "750ml", "badge": "Refreshing", "img": "https://images.unsplash.com/photo-1559839914-17aae19cea0e"},
    {"name": "Classic Cola Soda", "cat": "beverages", "price": 6.50, "unit": "1.5L", "badge": "", "img": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"},
    {"name": "Energy Drink (Red)", "cat": "beverages", "price": 8.00, "unit": "250ml", "badge": "Taurine", "img": "https://images.unsplash.com/photo-1622543953491-f07a3bc3d997"},

    # Snacks & Sweets
    {"name": "Sea Salt Potato Chips", "cat": "snacks-sweets", "price": 6.50, "unit": "100g", "badge": "Extra Crispy", "img": "https://images.unsplash.com/photo-1566478431375-707a62544e53"},
    {"name": "Large Medjool Dates", "cat": "snacks-sweets", "price": 35.00, "unit": "1kg box", "badge": "Natural", "img": "https://images.unsplash.com/photo-1541011384039-16e7884d32e9"},
    {"name": "Swiss Milk Chocolate", "cat": "snacks-sweets", "price": 4.50, "unit": "100g bar", "badge": "Smooth", "img": "https://images.unsplash.com/photo-1549007994-cb92caebd54b"},
    {"name": "Mixed Roasted Nuts", "cat": "snacks-sweets", "price": 22.00, "unit": "250g bag", "badge": "No Salt", "img": "https://images.unsplash.com/photo-1508061253366-f7da158b6d46"},
    
    # Ready to Eat Foods
    {"name": "Beef Nuggets (Israel)", "cat": "ready-to-eat-foods", "price": 35.90, "unit": "600g", "badge": "Crispy", "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"},
    {"name": "Frozen Potato Blintzes", "cat": "ready-to-eat-foods", "price": 3.86, "unit": "per 100g", "badge": "Homemade", "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
]

def clear_db():
    print("Clearing database...")
    Product.query.delete()
    Category.query.delete()
    db.session.commit()

def seed_master():
    print("Seeding master categories...")
    cat_map = {}
    for slug, data in CATEGORIES_DATA.items():
        cat = Category.query.filter_by(slug=slug).first()
        if not cat:
            cat = Category(slug=slug, name=data["name"], image_url=data["img"])
            db.session.add(cat)
            db.session.commit()
        else:
            cat.name = data["name"]
            cat.image_url = data["img"]
            db.session.add(cat)
        cat_map[slug] = cat.id
    db.session.commit()

    print("Seeding master products...")
    for p_data in PRODUCTS_LIST:
        existing = Product.query.filter_by(name=p_data["name"]).first()
        if not existing:
            p = Product(
                name=p_data["name"],
                price=p_data["price"],
                image_url=p_data["img"],
                category_id=cat_map[p_data["cat"]],
                unit=p_data.get("unit"),
                badge=p_data.get("badge")
            )
            db.session.add(p)
        else:
            existing.price = p_data["price"]
            existing.image_url = p_data["img"]
            existing.unit = p_data.get("unit")
            existing.badge = p_data.get("badge")
            db.session.add(existing)

    db.session.commit()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        # Using clear_db for a fresh start with clean names
        clear_db()
        seed_master()

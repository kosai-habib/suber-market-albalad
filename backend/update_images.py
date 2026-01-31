import sqlite3

conn = sqlite3.connect('instance/supermarket.db')
cursor = conn.cursor()

# Map product names to local images
updates = [
    ('%Tomato%', '/images/products/tomato.png'),
    ('%Apple%', '/images/products/apple.png'),
    ('%Banana%', '/images/products/banana.png'),
    ('%Orange%', '/images/products/orange.png'),
    ('%Grape%Green%', '/images/products/green grapes.png'),
    ('%Grape%Blue%', '/images/products/blue grapes.png'),
    ('%Watermelon%', '/images/products/watermelon.png'),
    ('%Strawberr%', '/images/products/strawberry.png'),
    ('%Lichi%', '/images/products/lichi.png'),
    ('%Pepper%', '/images/products/red papper.png'),
    ('%Capsicum%', '/images/products/capsicum.png'),
    ('%Carrot%', '/images/products/carrot.png'),
    ('%Broccoli%', '/images/products/broccoli.png'),
    ('%Cauliflower%', '/images/products/cauliflower.png'),
    ('%Cabbage%', '/images/products/cabbage.png'),
    ('%Chicken%Breast%', '/images/products/chicken.png'),
    ('%Chicken%Leg%', '/images/products/chicken leg pieces.png'),
    ('%Beef%Steak%', '/images/products/beaf steak.png'),
    ('%Salmon%', '/images/products/salmon fish.png'),
    ('%Fish%Oily%', '/images/products/oily fishes.png'),
]

for pattern, img_path in updates:
    cursor.execute("UPDATE products SET image_url = ? WHERE name LIKE ?", (img_path, pattern))
    print(f"Updated products matching '{pattern}' to '{img_path}'")

conn.commit()

# Show updated products
cursor.execute("SELECT id, name, image_url FROM products WHERE image_url LIKE '/images/%' LIMIT 20")
results = cursor.fetchall()

print("\n✅ Updated Products:")
for row in results:
    print(f"  {row[0]}: {row[1]} -> {row[2]}")

conn.close()
print("\n✅ All product images updated successfully!")

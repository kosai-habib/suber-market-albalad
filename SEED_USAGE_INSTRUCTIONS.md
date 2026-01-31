# الخطوات المطلوبة لاستخدام seed_enhanced.py

## Step 1: تحديث models.py

افتح ملف: `/Users/kosay/Desktop/my data base/MCP/projects/suber-market-albalad/backend/app/models.py`

وعدّل الـ Product model:

```python
class Product(db.Model):
    __tablename__ = "products"

    # Existing columns
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255))
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
    is_discounted = db.Column(db.Boolean, default=False)
    discount_percent = db.Column(db.Integer, nullable=True)
    unit = db.Column(db.String(50))
    badge = db.Column(db.String(50))
    
    # NEW COLUMNS - أضف هذه الأعمدة:
    name_ar = db.Column(db.String(120))
    description = db.Column(db.Text)
    description_ar = db.Column(db.Text)
    brand = db.Column(db.String(80))
    weight = db.Column(db.String(50))
    stock_quantity = db.Column(db.Integer, default=100)
    sku = db.Column(db.String(50), unique=True)
    rating = db.Column(db.Float, default=0.0)
    reviews_count = db.Column(db.Integer, default=0)
    tags = db.Column(db.String(255))
    
    # Relationships
    category = db.relationship("Category", backref="products")
```

## Step 2: إنشاء Migration

```bash
cd backend
source venv/bin/activate
flask db migrate -m "Add enhanced product fields"
flask db upgrade
```

## Step 3: تشغيل الـ Seed الجديد

```bash
python app/seed_enhanced.py
```

---

## ملاحظات:

1. ✅ ملف seed_enhanced.py جاهز في: `/backend/app/seed_enhanced.py`
2. ✅ يحتوي على 28 منتج بدلاً من 15
3. ✅ كل منتج لديه بيانات كاملة (AR + EN)
4. ✅ أسماء عربية ووصف عربي
5. ✅ Brands, weights, stock, ratings

---

## البديل السريع (بدون migration):

إذا تريد اختبار سريع بدون تعديل الـ model:

1. افتح seed_enhanced.py
2. علّق على الأسطر التي تستخدم الأعمدة الجديدة (ضع # قبلها)
3. شغل السكريبت

لكن الأفضل: تحديث الـ model + migration!
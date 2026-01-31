"""
Serializers للتحويل من Models إلى JSON
يوحّد شكل الـ response في كل الـ endpoints
"""

def category_to_dict(c):
    """تحويل Category model إلى dictionary"""
    return {
        "id": c.id,
        "name": c.name,
        "slug": c.slug
    }

def product_to_dict(p):
    """تحويل Product model إلى dictionary"""
    return {
        "id": p.id,
        "name": p.name,
        "price": float(p.price),
        "image_url": getattr(p, "image_url", None),
        "category_id": p.category_id,
        "is_discounted": bool(getattr(p, "is_discounted", False)),
        "discount_percent": getattr(p, "discount_percent", None),
    }

def user_to_dict(u):
    """تحويل User model إلى dictionary"""
    # استخدم email كـ name إذا لم يكن موجود
    return {
        "id": u.id,
        "name": getattr(u, "name", u.email.split("@")[0]),  # اسم من email
        "email": u.email
    }

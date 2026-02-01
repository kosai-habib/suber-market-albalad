def user_to_dict(u):
    """تحويل User model إلى dictionary"""
    # استخدم email كـ name إذا لم يكن موجود
    return {
        "id": u.id,
        "name": getattr(u, "name", u.email.split("@")[0]),  # اسم من email
        "email": u.email,
        "created_at": u.created_at.isoformat() if hasattr(u, 'created_at') else None
    }

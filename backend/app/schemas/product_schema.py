def product_to_dict(p):
    """تحويل Product model إلى dictionary"""
    return {
        "id": p.id,
        "name": p.name,
        "price": float(p.price),
        "image_url": getattr(p, "image_url", None),
        "category_id": p.category_id,
        "category_name": p.category.name if hasattr(p, 'category') and p.category else None,
        "category_image": p.category.image_url if hasattr(p, 'category') and p.category else None,
        "is_discounted": bool(getattr(p, "is_discounted", False)),
        "discount_percent": getattr(p, "discount_percent", None),
        "unit": getattr(p, "unit", None),
        "badge": getattr(p, "badge", None)
    }

def category_to_dict(c):
    """تحويل Category model إلى dictionary"""
    return {
        "id": c.id,
        "name": c.name,
        "slug": c.slug,
        "image_url": getattr(c, "image_url", None)
    }

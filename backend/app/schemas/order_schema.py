def order_to_dict(order):
    return {
        "order_id": order.id,
        "order_number": order.order_number,
        "paid_at": order.paid_at.isoformat() if order.paid_at else None,
        "total_price": order.total_price,
        "status": order.status,
        "payment_method": order.payment_method,
        "payment_status": order.payment_status,
        "order_status": order.order_status,
        "subtotal": order.subtotal,
        "logistics_fee": order.logistics_fee,
        "total": order.total,
        "created_at": order.created_at.isoformat()
    }

def order_item_to_dict(item):
    return {
        "product_id": item.product_id,
        "product_name": item.product.name,
        "product": {
            "id": item.product.id,
            "name": item.product.name,
            "price": item.price_at_purchase,  # Use price at purchase time
            "image_url": item.product.image_url if hasattr(item.product, 'image_url') else None
        },
        "quantity": item.quantity,
        "price_at_purchase": item.price_at_purchase,
        "line_total": item.line_total
    }

def order_with_items_to_dict(order):
    response = order_to_dict(order)
    response["items"] = [order_item_to_dict(item) for item in order.order_items]
    return response

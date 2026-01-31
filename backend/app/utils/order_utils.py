def format_order_response(order):
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


def format_order_item_response(item):
    return {
        "product_id": item.product_id,
        "product_name": item.product.name,
        "quantity": item.quantity,
        "price_at_purchase": item.price_at_purchase,
        "line_total": item.line_total
    }


def format_order_with_items(order):
    response = format_order_response(order)
    response["items"] = [format_order_item_response(item) for item in order.items]
    return response

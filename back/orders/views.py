import json
from decimal import Decimal

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from accounts.models import User
from marketplace.models import Product
from .models import Order, OrderItem


@csrf_exempt
def orders_list_create(request):
    if request.method == "GET":
        data = list(
            Order.objects.select_related("user").values(
                "id",
                "total_amount",
                "status",
                "shipping_address",
                "created_at",
                "user__id",
                "user__username",
                "user__full_name",
            )
        )
        return JsonResponse(data, safe=False)

    if request.method == "POST":
        try:
            payload = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "JSON invalide."}, status=400)

        user_id = payload.get("user_id")
        shipping_address = payload.get("shipping_address")
        items = payload.get("items", [])

        if not user_id or not shipping_address or not items:
            return JsonResponse(
                {"error": "user_id, shipping_address et items sont obligatoires."},
                status=400,
            )

        user = get_object_or_404(User, pk=user_id)

        order = Order.objects.create(
            user=user,
            shipping_address=shipping_address,
            total_amount=Decimal("0.00"),
        )

        total = Decimal("0.00")

        for item in items:
            product_id = item.get("product_id")
            quantity = item.get("quantity", 1)

            if not product_id:
                return JsonResponse(
                    {"error": "Chaque item doit contenir product_id."},
                    status=400,
                )

            product = get_object_or_404(Product, pk=product_id)

            unit_price = product.price
            line_total = unit_price * quantity
            total += line_total

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                unit_price=unit_price,
            )

        order.total_amount = total
        order.save(update_fields=["total_amount"])

        return JsonResponse(
            {
                "message": "Commande créée avec succès.",
                "order": {
                    "id": order.id,
                    "user_id": order.user.id,
                    "total_amount": str(order.total_amount),
                    "status": order.status,
                    "shipping_address": order.shipping_address,
                },
            },
            status=201,
        )

    return JsonResponse({"error": "Méthode non autorisée."}, status=405)


def order_detail(request, pk):
    order = get_object_or_404(
        Order.objects.select_related("user").prefetch_related("items__product"),
        pk=pk,
    )

    items_data = []
    for item in order.items.all():
        items_data.append(
            {
                "id": item.id,
                "product": {
                    "id": item.product.id,
                    "name": item.product.name,
                },
                "quantity": item.quantity,
                "unit_price": str(item.unit_price),
            }
        )

    data = {
        "id": order.id,
        "total_amount": str(order.total_amount),
        "status": order.status,
        "shipping_address": order.shipping_address,
        "created_at": order.created_at,
        "user": {
            "id": order.user.id,
            "username": order.user.username,
            "full_name": order.user.full_name,
        },
        "items": items_data,
    }
    return JsonResponse(data)
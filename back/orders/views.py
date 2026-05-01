from decimal import Decimal

from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdminRole
from rest_framework.response import Response
from rest_framework import status
from marketplace.models import Product
from .models import Order, OrderItem
from accounts.permissions import IsAuthenticatedUser

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@permission_classes([IsAuthenticatedUser])
def orders_list_create(request):
    if request.method == "GET":
        data = list(
            Order.objects.select_related("user")
            .filter(user=request.user)
            .values(
                "id",
                "total_amount",
                "status",
                "shipping_address",
                "created_at",
            )
        )
        return JsonResponse(data, safe=False)

    payload = request.data
    shipping_address = payload.get("shipping_address")
    items = payload.get("items", [])

    if not shipping_address or not items:
        return JsonResponse(
            {"error": "shipping_address et items sont obligatoires."},
            status=400,
        )

    order = Order.objects.create(
        user=request.user,
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

        product = Product.objects.filter(pk=product_id).first()
        if not product:
            return JsonResponse(
                {"error": f"Produit introuvable pour product_id={product_id}."},
                status=400,
            )

        unit_price = product.price
        total += unit_price * quantity

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
                "total_amount": str(order.total_amount),
                "status": order.status,
                "shipping_address": order.shipping_address,
            },
        },
        status=201,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def order_detail(request, pk):
    order = get_object_or_404(
        Order.objects.select_related("user").prefetch_related("items__product"),
        pk=pk,
        user=request.user,
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
        "items": items_data,
    }
    return JsonResponse(data)

@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_orders_list(request):
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
    return Response(data, status=status.HTTP_200_OK)


@api_view(["PATCH"])
@permission_classes([IsAdminRole])
def admin_order_update_status(request, pk):
    order = get_object_or_404(Order, pk=pk)

    new_status = request.data.get("status")

    allowed_statuses = ["pending", "paid", "shipped", "delivered", "cancelled"]

    if not new_status:
        return Response(
            {"error": "Le champ status est obligatoire."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if new_status not in allowed_statuses:
        return Response(
            {
                "error": f"Statut invalide. Valeurs autorisées : {', '.join(allowed_statuses)}."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    order.status = new_status
    order.save(update_fields=["status"])

    return Response(
        {
            "message": "Statut de la commande mis à jour avec succès.",
            "order": {
                "id": order.id,
                "status": order.status,
                "total_amount": str(order.total_amount),
            },
        },
        status=status.HTTP_200_OK,
    )
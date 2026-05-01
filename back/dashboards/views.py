from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from accounts.permissions import IsAdminRole
from accounts.models import User
from partners.models import PartnerProfile
from catalog.models import Service
from marketplace.models import Product
from bookings.models import Booking
from orders.models import Order
from reviews.models import Review
from django.shortcuts import get_object_or_404
from django.db.models import Avg
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from accounts.permissions import IsAuthenticatedUser
from bookings.models import Booking
from orders.models import Order
from reviews.models import Review
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from accounts.permissions import IsPartner
from partners.models import PartnerProfile
from catalog.models import Service
from marketplace.models import Product
from bookings.models import Booking
from orders.models import Order
from reviews.models import Review

@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_dashboard(request):
    data = {
        "users_count": User.objects.count(),
        "partners_count": PartnerProfile.objects.count(),
        "verified_partners_count": PartnerProfile.objects.filter(is_verified=True).count(),
        "services_count": Service.objects.count(),
        "active_services_count": Service.objects.filter(is_active=True).count(),
        "products_count": Product.objects.count(),
        "active_products_count": Product.objects.filter(is_active=True).count(),
        "bookings_count": Booking.objects.count(),
        "orders_count": Order.objects.count(),
        "reviews_count": Review.objects.count(),
    }
    return Response(data, status=status.HTTP_200_OK)
@api_view(["GET"])
@permission_classes([IsPartner])
def partner_dashboard(request):
    partner = get_object_or_404(PartnerProfile, user=request.user)

    services_count = Service.objects.filter(partner=partner).count()
    active_services_count = Service.objects.filter(partner=partner, is_active=True).count()

    products_count = Product.objects.filter(partner=partner).count()
    active_products_count = Product.objects.filter(partner=partner, is_active=True).count()

    bookings_count = Booking.objects.filter(service__partner=partner).count()
    confirmed_bookings_count = Booking.objects.filter(
        service__partner=partner,
        status="confirmed"
    ).count()

    orders_count = Order.objects.filter(items__product__partner=partner).distinct().count()

    reviews_count = Review.objects.filter(service__partner=partner).count() + Review.objects.filter(product__partner=partner).count()

    avg_service_rating = Review.objects.filter(service__partner=partner).aggregate(avg=Avg("rating"))["avg"]
    avg_product_rating = Review.objects.filter(product__partner=partner).aggregate(avg=Avg("rating"))["avg"]

    data = {
        "partner": {
            "id": partner.id,
            "business_name": partner.business_name,
            "activity_type": partner.activity_type,
            "description": partner.description,
            "address": partner.address,
            "is_verified": partner.is_verified,
            "region": partner.region.name if partner.region else None,
        },
        "stats": {
            "services_count": services_count,
            "active_services_count": active_services_count,
            "products_count": products_count,
            "active_products_count": active_products_count,
            "bookings_count": bookings_count,
            "confirmed_bookings_count": confirmed_bookings_count,
            "orders_count": orders_count,
            "reviews_count": reviews_count,
            "avg_service_rating": round(avg_service_rating, 2) if avg_service_rating else None,
            "avg_product_rating": round(avg_product_rating, 2) if avg_product_rating else None,
        },
    }

    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsPartner])
def partner_services_list(request):
    partner = get_object_or_404(PartnerProfile, user=request.user)

    data = list(
        Service.objects.filter(partner=partner).select_related("category", "region").values(
            "id",
            "title",
            "description",
            "price",
            "address",
            "is_active",
            "created_at",
            "category__name",
            "region__name",
        )
    )
    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsPartner])
def partner_products_list(request):
    partner = get_object_or_404(PartnerProfile, user=request.user)

    data = list(
        Product.objects.filter(partner=partner).select_related("category", "region").values(
            "id",
            "name",
            "description",
            "price",
            "stock",
            "is_active",
            "created_at",
            "category__name",
            "region__name",
        )
    )
    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsPartner])
def partner_bookings_list(request):
    partner = get_object_or_404(PartnerProfile, user=request.user)

    data = list(
        Booking.objects.filter(service__partner=partner).select_related("user", "service").values(
            "id",
            "booking_date",
            "guests",
            "status",
            "created_at",
            "user__username",
            "user__full_name",
            "service__title",
        )
    )
    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsPartner])
def partner_orders_list(request):
    partner = get_object_or_404(PartnerProfile, user=request.user)

    orders = Order.objects.filter(items__product__partner=partner).distinct().prefetch_related("items__product", "user")

    data = []
    for order in orders:
        partner_items = []
        for item in order.items.all():
            if item.product.partner_id == partner.id:
                partner_items.append(
                    {
                        "product_id": item.product.id,
                        "product_name": item.product.name,
                        "quantity": item.quantity,
                        "unit_price": str(item.unit_price),
                    }
                )

        data.append(
            {
                "id": order.id,
                "status": order.status,
                "total_amount": str(order.total_amount),
                "shipping_address": order.shipping_address,
                "created_at": order.created_at,
                "customer": {
                    "id": order.user.id,
                    "username": order.user.username,
                    "full_name": order.user.full_name,
                },
                "items": partner_items,
            }
        )

    return Response(data, status=status.HTTP_200_OK)
@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def user_dashboard(request):
    user = request.user

    bookings_count = Booking.objects.filter(user=user).count()
    confirmed_bookings_count = Booking.objects.filter(user=user, status="confirmed").count()

    orders_count = Order.objects.filter(user=user).count()
    reviews_count = Review.objects.filter(user=user).count()

    data = {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "phone": user.phone,
            "role": user.role,
        },
        "stats": {
            "bookings_count": bookings_count,
            "confirmed_bookings_count": confirmed_bookings_count,
            "orders_count": orders_count,
            "reviews_count": reviews_count,
        },
    }

    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def user_bookings_list(request):
    data = list(
        Booking.objects.filter(user=request.user)
        .select_related("service")
        .values(
            "id",
            "booking_date",
            "guests",
            "status",
            "created_at",
            "service__id",
            "service__title",
        )
    )
    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def user_orders_list(request):
    orders = Order.objects.filter(user=request.user).prefetch_related("items__product")

    data = []
    for order in orders:
        items_data = []
        for item in order.items.all():
            items_data.append(
                {
                    "product_id": item.product.id,
                    "product_name": item.product.name,
                    "quantity": item.quantity,
                    "unit_price": str(item.unit_price),
                }
            )

        data.append(
            {
                "id": order.id,
                "status": order.status,
                "total_amount": str(order.total_amount),
                "shipping_address": order.shipping_address,
                "created_at": order.created_at,
                "items": items_data,
            }
        )

    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def user_reviews_list(request):
    data = list(
        Review.objects.filter(user=request.user)
        .select_related("service", "product")
        .values(
            "id",
            "rating",
            "comment",
            "created_at",
            "service__id",
            "service__title",
            "product__id",
            "product__name",
        )
    )
    return Response(data, status=status.HTTP_200_OK)
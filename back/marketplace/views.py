from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework.decorators import api_view, permission_classes

from accounts.permissions import IsPartnerOrReadOnly
from partners.models import PartnerProfile
from locations.models import Region
from .models import Product, ProductCategory


@api_view(["GET", "POST"])
@permission_classes([IsPartnerOrReadOnly])
def products_list(request):
    if request.method == "GET":
        queryset = Product.objects.select_related("partner", "category", "region")

        region = request.GET.get("region")
        category = request.GET.get("category")
        q = request.GET.get("q")

        if region:
            queryset = queryset.filter(region__slug__icontains=region)

        if category:
            queryset = queryset.filter(category__slug__icontains=category)

        if q:
            queryset = queryset.filter(
                Q(name__icontains=q) |
                Q(description__icontains=q) |
                Q(partner__business_name__icontains=q)
            )

        data = list(
            queryset.values(
                "id",
                "name",
                "description",
                "price",
                "stock",
                "image",
                "is_active",
                "created_at",
                "partner__business_name",
                "category__name",
                "category__slug",
                "region__name",
                "region__slug",
            )
        )
        return JsonResponse(data, safe=False)

    partner = get_object_or_404(PartnerProfile, user=request.user)

    payload = request.data
    category_id = payload.get("category_id")
    region_id = payload.get("region_id")
    name = payload.get("name")
    description = payload.get("description")
    price = payload.get("price")
    stock = payload.get("stock", 0)

    if not all([category_id, name, description, price]):
        return JsonResponse(
            {"error": "category_id, name, description et price sont obligatoires."},
            status=400,
        )

    category = get_object_or_404(ProductCategory, pk=category_id)
    region = Region.objects.filter(pk=region_id).first() if region_id else None

    product = Product.objects.create(
        partner=partner,
        category=category,
        region=region,
        name=name,
        description=description,
        price=price,
        stock=stock,
    )

    return JsonResponse(
        {
            "message": "Produit créé avec succès.",
            "product": {
                "id": product.id,
                "name": product.name,
                "price": str(product.price),
                "stock": product.stock,
            },
        },
        status=201,
    )


@api_view(["GET"])
def product_detail(request, pk):
    product = get_object_or_404(
        Product.objects.select_related("partner", "category", "region"),
        pk=pk,
    )
    data = {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": str(product.price),
        "stock": product.stock,
        "image": product.image.url if product.image else None,
        "is_active": product.is_active,
        "created_at": product.created_at,
        "partner": {
            "id": product.partner.id,
            "business_name": product.partner.business_name,
        },
        "category": {
            "name": product.category.name if product.category else None,
            "slug": product.category.slug if product.category else None,
        },
        "region": {
            "name": product.region.name if product.region else None,
            "slug": product.region.slug if product.region else None,
        },
    }
    return JsonResponse(data)
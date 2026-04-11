from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Product


def products_list(request):
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
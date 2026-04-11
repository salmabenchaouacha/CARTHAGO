from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Service


def services_list(request):
    queryset = Service.objects.select_related("partner", "category", "region")

    region = request.GET.get("region")
    category = request.GET.get("category")
    q = request.GET.get("q")

    if region:
        queryset = queryset.filter(region__slug__icontains=region)

    if category:
        queryset = queryset.filter(category__slug__icontains=category)

    if q:
        queryset = queryset.filter(
            Q(title__icontains=q) |
            Q(description__icontains=q) |
            Q(address__icontains=q) |
            Q(partner__business_name__icontains=q)
        )

    data = list(
        queryset.values(
            "id",
            "title",
            "description",
            "price",
            "address",
            "latitude",
            "longitude",
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


def service_detail(request, pk):
    service = get_object_or_404(
        Service.objects.select_related("partner", "category", "region"),
        pk=pk,
    )
    data = {
        "id": service.id,
        "title": service.title,
        "description": service.description,
        "price": str(service.price),
        "address": service.address,
        "latitude": str(service.latitude) if service.latitude is not None else None,
        "longitude": str(service.longitude) if service.longitude is not None else None,
        "is_active": service.is_active,
        "created_at": service.created_at,
        "partner": {
            "id": service.partner.id,
            "business_name": service.partner.business_name,
        },
        "category": {
            "name": service.category.name if service.category else None,
            "slug": service.category.slug if service.category else None,
        },
        "region": {
            "name": service.region.name if service.region else None,
            "slug": service.region.slug if service.region else None,
        },
    }
    return JsonResponse(data)
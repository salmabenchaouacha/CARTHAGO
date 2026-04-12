from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework.decorators import api_view, permission_classes

from accounts.permissions import IsPartnerOrReadOnly
from partners.models import PartnerProfile
from locations.models import Region
from .models import Service, ServiceCategory


@api_view(["GET", "POST"])
@permission_classes([IsPartnerOrReadOnly])
def services_list(request):
    if request.method == "GET":
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

    partner = get_object_or_404(PartnerProfile, user=request.user)

    payload = request.data
    category_id = payload.get("category_id")
    region_id = payload.get("region_id")
    title = payload.get("title")
    description = payload.get("description")
    price = payload.get("price")
    address = payload.get("address")
    latitude = payload.get("latitude")
    longitude = payload.get("longitude")

    if not all([category_id, title, description, price, address]):
        return JsonResponse(
            {"error": "category_id, title, description, price et address sont obligatoires."},
            status=400,
        )

    category = get_object_or_404(ServiceCategory, pk=category_id)
    region = Region.objects.filter(pk=region_id).first() if region_id else None

    service = Service.objects.create(
        partner=partner,
        category=category,
        region=region,
        title=title,
        description=description,
        price=price,
        address=address,
        latitude=latitude,
        longitude=longitude,
    )

    return JsonResponse(
        {
            "message": "Service créé avec succès.",
            "service": {
                "id": service.id,
                "title": service.title,
                "price": str(service.price),
                "address": service.address,
            },
        },
        status=201,
    )


@api_view(["GET"])
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
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from accounts.permissions import IsPartnerOrReadOnly
from partners.models import PartnerProfile
from locations.models import Region
from .models import Service, ServiceCategory

from accounts.permissions import IsAdminRole

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


@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsPartnerOrReadOnly])
def service_detail(request, pk):
    service = get_object_or_404(
        Service.objects.select_related("partner", "category", "region"),
        pk=pk,
    )

    if request.method == "GET":
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

    if service.partner.user != request.user:
        return Response(
            {"error": "Vous ne pouvez modifier ou supprimer que vos propres services."},
            status=status.HTTP_403_FORBIDDEN,
        )

    if request.method == "PATCH":
        payload = request.data

        category_id = payload.get("category_id")
        region_id = payload.get("region_id")

        if "title" in payload:
            service.title = payload.get("title")
        if "description" in payload:
            service.description = payload.get("description")
        if "price" in payload:
            service.price = payload.get("price")
        if "address" in payload:
            service.address = payload.get("address")
        if "latitude" in payload:
            service.latitude = payload.get("latitude")
        if "longitude" in payload:
            service.longitude = payload.get("longitude")
        if "is_active" in payload:
            service.is_active = payload.get("is_active")

        if category_id is not None:
            service.category = get_object_or_404(ServiceCategory, pk=category_id)

        if region_id is not None:
            service.region = Region.objects.filter(pk=region_id).first()

        service.save()

        return Response(
            {
                "message": "Service mis à jour avec succès.",
                "service": {
                    "id": service.id,
                    "title": service.title,
                    "price": str(service.price),
                    "address": service.address,
                    "is_active": service.is_active,
                },
            },
            status=status.HTTP_200_OK,
        )

    service.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

def _to_bool(value):
    if isinstance(value, bool):
        return value
    if str(value).lower() in ["true", "1", "yes", "oui"]:
        return True
    if str(value).lower() in ["false", "0", "no", "non"]:
        return False
    return None


@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_services_list(request):
    data = list(
        Service.objects.select_related("partner", "category", "region").values(
            "id",
            "title",
            "description",
            "price",
            "address",
            "is_active",
            "created_at",
            "partner__id",
            "partner__business_name",
            "category__id",
            "category__name",
            "region__id",
            "region__name",
        )
    )
    return Response(data, status=status.HTTP_200_OK)


@api_view(["PATCH"])
@permission_classes([IsAdminRole])
def admin_service_toggle(request, pk):
    service = get_object_or_404(
        Service.objects.select_related("partner", "category", "region"),
        pk=pk,
    )

    if "is_active" not in request.data:
        return Response(
            {"error": "Le champ is_active est obligatoire."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    is_active = _to_bool(request.data.get("is_active"))
    if is_active is None:
        return Response(
            {"error": "is_active doit être true ou false."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    service.is_active = is_active
    service.save(update_fields=["is_active"])

    return Response(
        {
            "message": "Statut du service mis à jour avec succès.",
            "service": {
                "id": service.id,
                "title": service.title,
                "is_active": service.is_active,
            },
        },
        status=status.HTTP_200_OK,
    )
    
@api_view(["DELETE"])
@permission_classes([IsAdminRole])
def admin_service_delete(request, pk):
    service = get_object_or_404(Service, pk=pk)
    service.delete()
    return Response(
        {"message": "Service supprimé avec succès."},
        status=status.HTTP_200_OK,
    )
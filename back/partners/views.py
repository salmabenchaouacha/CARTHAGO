from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import PartnerProfile
from accounts.permissions import IsAdminRole

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

def partners_list(request):
    queryset = PartnerProfile.objects.select_related("user", "region")

    region = request.GET.get("region")
    activity_type = request.GET.get("activity_type")
    q = request.GET.get("q")

    if region:
        queryset = queryset.filter(region__slug__icontains=region)

    if activity_type:
        queryset = queryset.filter(activity_type__icontains=activity_type)

    if q:
        queryset = queryset.filter(
            Q(business_name__icontains=q) |
            Q(description__icontains=q) |
            Q(address__icontains=q) |
            Q(user__full_name__icontains=q)
        )

    data = list(
        queryset.values(
            "id",
            "business_name",
            "activity_type",
            "description",
            "address",
            "latitude",
            "longitude",
            "is_verified",
            "created_at",
            "user__username",
            "user__full_name",
            "region__name",
            "region__slug",
        )
    )
    return JsonResponse(data, safe=False)


def partner_detail(request, pk):
    partner = get_object_or_404(
        PartnerProfile.objects.select_related("user", "region"),
        pk=pk,
    )
    data = {
        "id": partner.id,
        "business_name": partner.business_name,
        "activity_type": partner.activity_type,
        "description": partner.description,
        "address": partner.address,
        "latitude": str(partner.latitude) if partner.latitude is not None else None,
        "longitude": str(partner.longitude) if partner.longitude is not None else None,
        "is_verified": partner.is_verified,
        "created_at": partner.created_at,
        "user": {
            "username": partner.user.username,
            "full_name": partner.user.full_name,
        },
        "region": {
            "name": partner.region.name if partner.region else None,
            "slug": partner.region.slug if partner.region else None,
        },
    }
    return JsonResponse(data)
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
def admin_partners_list(request):
    data = list(
        PartnerProfile.objects.select_related("user", "region").values(
            "id",
            "business_name",
            "activity_type",
            "description",
            "address",
            "latitude",
            "longitude",
            "is_verified",
            "created_at",
            "user__id",
            "user__username",
            "user__email",
            "user__full_name",
            "region__id",
            "region__name",
        )
    )
    return Response(data, status=status.HTTP_200_OK)


@api_view(["PATCH"])
@permission_classes([IsAdminRole])
def admin_partner_verify(request, pk):
    partner = get_object_or_404(
        PartnerProfile.objects.select_related("user", "region"),
        pk=pk,
    )

    if "is_verified" not in request.data:
        return Response(
            {"error": "Le champ is_verified est obligatoire."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    is_verified = _to_bool(request.data.get("is_verified"))
    if is_verified is None:
        return Response(
            {"error": "is_verified doit être true ou false."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    partner.is_verified = is_verified
    partner.save(update_fields=["is_verified"])

    return Response(
        {
            "message": "Statut du partenaire mis à jour avec succès.",
            "partner": {
                "id": partner.id,
                "business_name": partner.business_name,
                "is_verified": partner.is_verified,
            },
        },
        status=status.HTTP_200_OK,
    )
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from catalog.models import Service
from .models import Booking

from accounts.permissions import IsAuthenticatedUser
from accounts.permissions import IsAdminRole

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@permission_classes([IsAuthenticatedUser])
def bookings_list_create(request):
    if request.method == "GET":
        data = list(
            Booking.objects.select_related("user", "service")
            .filter(user=request.user)
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
        return JsonResponse(data, safe=False)

    payload = request.data
    service_id = payload.get("service_id")
    booking_date = payload.get("booking_date")
    guests = payload.get("guests", 1)

    if not service_id or not booking_date:
        return JsonResponse(
            {"error": "service_id et booking_date sont obligatoires."},
            status=400,
        )

    service = get_object_or_404(Service, pk=service_id)

    booking = Booking.objects.create(
        user=request.user,
        service=service,
        booking_date=booking_date,
        guests=guests,
    )

    return JsonResponse(
        {
            "message": "Réservation créée avec succès.",
            "booking": {
                "id": booking.id,
                "service_id": booking.service.id,
                "booking_date": str(booking.booking_date),
                "guests": booking.guests,
                "status": booking.status,
            },
        },
        status=201,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def booking_detail(request, pk):
    booking = get_object_or_404(
        Booking.objects.select_related("user", "service"),
        pk=pk,
        user=request.user,
    )

    data = {
        "id": booking.id,
        "booking_date": str(booking.booking_date),
        "guests": booking.guests,
        "status": booking.status,
        "created_at": booking.created_at,
        "service": {
            "id": booking.service.id,
            "title": booking.service.title,
        },
    }
    return JsonResponse(data)

@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_bookings_list(request):
    data = list(
        Booking.objects.select_related("user", "service").values(
            "id",
            "booking_date",
            "guests",
            "status",
            "created_at",
            "user__id",
            "user__username",
            "user__full_name",
            "service__id",
            "service__title",
        )
    )
    return Response(data, status=status.HTTP_200_OK)

@api_view(["PATCH"])
@permission_classes([IsAdminRole])
def admin_booking_update_status(request, pk):
    booking = get_object_or_404(Booking, pk=pk)

    new_status = request.data.get("status")

    allowed_statuses = ["pending", "confirmed", "cancelled"]

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

    booking.status = new_status
    booking.save(update_fields=["status"])

    return Response(
        {
            "message": "Statut de la réservation mis à jour avec succès.",
            "booking": {
                "id": booking.id,
                "status": booking.status,
                "booking_date": str(booking.booking_date),
            },
        },
        status=status.HTTP_200_OK,
    )
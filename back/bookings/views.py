from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from catalog.models import Service
from .models import Booking

from accounts.permissions import IsAuthenticatedUser

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
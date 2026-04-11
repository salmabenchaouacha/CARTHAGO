import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from accounts.models import User
from catalog.models import Service
from .models import Booking


@csrf_exempt
def bookings_list_create(request):
    if request.method == "GET":
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
        return JsonResponse(data, safe=False)

    if request.method == "POST":
        try:
            payload = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse(
                {"error": "JSON invalide."},
                status=400,
            )

        user_id = payload.get("user_id")
        service_id = payload.get("service_id")
        booking_date = payload.get("booking_date")
        guests = payload.get("guests", 1)

        if not user_id or not service_id or not booking_date:
            return JsonResponse(
                {"error": "user_id, service_id et booking_date sont obligatoires."},
                status=400,
            )

        user = get_object_or_404(User, pk=user_id)
        service = get_object_or_404(Service, pk=service_id)

        booking = Booking.objects.create(
            user=user,
            service=service,
            booking_date=booking_date,
            guests=guests,
        )

        return JsonResponse(
            {
                "message": "Réservation créée avec succès.",
                "booking": {
                    "id": booking.id,
                    "user_id": booking.user.id,
                    "service_id": booking.service.id,
                    "booking_date": str(booking.booking_date),
                    "guests": booking.guests,
                    "status": booking.status,
                },
            },
            status=201,
        )

    return JsonResponse({"error": "Méthode non autorisée."}, status=405)


def booking_detail(request, pk):
    booking = get_object_or_404(
        Booking.objects.select_related("user", "service"),
        pk=pk,
    )

    data = {
        "id": booking.id,
        "booking_date": str(booking.booking_date),
        "guests": booking.guests,
        "status": booking.status,
        "created_at": booking.created_at,
        "user": {
            "id": booking.user.id,
            "username": booking.user.username,
            "full_name": booking.user.full_name,
        },
        "service": {
            "id": booking.service.id,
            "title": booking.service.title,
        },
    }
    return JsonResponse(data)
from django.urls import path
from .views import bookings_list_create, booking_detail

urlpatterns = [
    path("bookings/", bookings_list_create, name="bookings-list-create"),
    path("bookings/<int:pk>/", booking_detail, name="booking-detail"),
]
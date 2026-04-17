from django.urls import path
from .views import (
    bookings_list_create,
    booking_detail,
    admin_bookings_list,
    admin_booking_update_status,
)

urlpatterns = [
    path("bookings/", bookings_list_create, name="bookings-list-create"),
    path("bookings/<int:pk>/", booking_detail, name="booking-detail"),

    path("admin/bookings/", admin_bookings_list, name="admin-bookings-list"),
    path("admin/bookings/<int:pk>/status/", admin_booking_update_status, name="admin-booking-update-status"),
]
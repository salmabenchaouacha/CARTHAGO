from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("user", "service", "booking_date", "guests", "status", "created_at")
    list_filter = ("status", "booking_date", "created_at")
    search_fields = ("user__username", "service__title")
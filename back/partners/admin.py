
from django.contrib import admin
from .models import PartnerProfile

@admin.register(PartnerProfile)
class PartnerProfileAdmin(admin.ModelAdmin):
    list_display  = ("business_name", "activity_type", "is_verified", "created_at")
    list_filter   = ("activity_type", "is_verified")
    search_fields = ("business_name", "address")
from django.conf import settings
from django.db import models


class PartnerProfile(models.Model):
    TYPE_ARTISAN = "artisan"
    TYPE_GUEST_HOUSE = "guest_house"
    TYPE_RESTAURANT = "restaurant"
    TYPE_GUIDE = "guide"
    TYPE_TOURISM = "tourism"

    TYPE_CHOICES = [
        (TYPE_ARTISAN, "Artisan"),
        (TYPE_GUEST_HOUSE, "Maison d'hôte"),
        (TYPE_RESTAURANT, "Restaurant"),
        (TYPE_GUIDE, "Guide"),
        (TYPE_TOURISM, "Prestataire touristique"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="partner_profile",
    )
    business_name = models.CharField(max_length=255)
    activity_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    description = models.TextField()
    address = models.CharField(max_length=255)
    region = models.ForeignKey(
        "locations.Region",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="partners",
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.business_name
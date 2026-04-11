from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_USER = "user"
    ROLE_PARTNER = "partner"
    ROLE_ADMIN = "admin"

    ROLE_CHOICES = [
        (ROLE_USER, "Utilisateur"),
        (ROLE_PARTNER, "Partenaire"),
        (ROLE_ADMIN, "Admin"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_USER)
    full_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=30, blank=True, null=True)

    def __str__(self):
        return self.username
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class Review(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    service = models.ForeignKey(
        "catalog.Service",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="reviews",
    )
    product = models.ForeignKey(
        "marketplace.Product",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="reviews",
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if not self.service and not self.product:
            raise ValidationError("Un avis doit être lié à un service ou à un produit.")

        if self.service and self.product:
            raise ValidationError("Un avis ne peut pas être lié à un service et à un produit en même temps.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        target = self.service.title if self.service else self.product.name
        return f"{self.user.username} - {target} ({self.rating}/5)"
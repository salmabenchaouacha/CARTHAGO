from django.db import models


class ProductCategory(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    partner = models.ForeignKey(
        "partners.PartnerProfile",
        on_delete=models.CASCADE,
        related_name="products",
    )
    category = models.ForeignKey(
        "marketplace.ProductCategory",
        on_delete=models.SET_NULL,
        null=True,
        related_name="products",
    )
    region = models.ForeignKey(
        "locations.Region",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products",
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    image       = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
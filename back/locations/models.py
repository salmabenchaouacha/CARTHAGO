from django.db import models

class Region(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="regions/", blank=True, null=True)

    def __str__(self):
        return self.name
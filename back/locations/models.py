from django.db import models

class Region(models.Model):
    name        = models.CharField(max_length=120, unique=True)
    slug        = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image       = models.URLField(blank=True, null=True)
    specialties = models.JSONField(default=list, blank=True)  # ["Harissa", "Brik", ...]
    activities  = models.JSONField(default=list, blank=True)  # ["Plongée", "Randonnée", ...]

    def __str__(self):
        return self.name
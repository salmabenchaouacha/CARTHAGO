from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Region

def regions_list(request):
    regions = Region.objects.all().values(
        "id", "name", "slug", "description", "image",
        "specialties", "activities"
    )

    data = []
    for r in regions:
        data.append({
            **r,
            "image": r["image"],  # ✅ NE PAS toucher
        })

    return JsonResponse(data, safe=False)


def region_detail(request, pk):
    region = get_object_or_404(Region, pk=pk)

    data = {
        "id": region.id,
        "name": region.name,
        "slug": region.slug,
        "description": region.description,
        "image": region.image,  # ✅ DIRECT
        "specialties": region.specialties,
        "activities": region.activities,
    }

    return JsonResponse(data)
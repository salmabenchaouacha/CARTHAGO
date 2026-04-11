from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Region


def regions_list(request):
    data = list(
        Region.objects.values("id", "name", "slug", "description")
    )
    return JsonResponse(data, safe=False)


def region_detail(request, pk):
    region = get_object_or_404(Region, pk=pk)
    data = {
        "id": region.id,
        "name": region.name,
        "slug": region.slug,
        "description": region.description,
        "image": region.image.url if region.image else None,
    }
    return JsonResponse(data)
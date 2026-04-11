import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from accounts.models import User
from catalog.models import Service
from marketplace.models import Product
from .models import Review


@csrf_exempt
def reviews_list_create(request):
    if request.method == "GET":
        data = list(
            Review.objects.select_related("user", "service", "product").values(
                "id",
                "rating",
                "comment",
                "created_at",
                "user__id",
                "user__username",
                "user__full_name",
                "service__id",
                "service__title",
                "product__id",
                "product__name",
            )
        )
        return JsonResponse(data, safe=False)

    if request.method == "POST":
        try:
            payload = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "JSON invalide."}, status=400)

        user_id = payload.get("user_id")
        service_id = payload.get("service_id")
        product_id = payload.get("product_id")
        rating = payload.get("rating")
        comment = payload.get("comment", "")

        if not user_id or not rating:
            return JsonResponse(
                {"error": "user_id et rating sont obligatoires."},
                status=400,
            )

        if not service_id and not product_id:
            return JsonResponse(
                {"error": "Un avis doit viser un service ou un produit."},
                status=400,
            )

        if service_id and product_id:
            return JsonResponse(
                {"error": "Un avis ne peut pas viser un service et un produit à la fois."},
                status=400,
            )

        user = get_object_or_404(User, pk=user_id)

        service = None
        product = None

        if service_id:
            service = get_object_or_404(Service, pk=service_id)

        if product_id:
            product = get_object_or_404(Product, pk=product_id)

        review = Review.objects.create(
            user=user,
            service=service,
            product=product,
            rating=rating,
            comment=comment,
        )

        return JsonResponse(
            {
                "message": "Avis créé avec succès.",
                "review": {
                    "id": review.id,
                    "user_id": review.user.id,
                    "service_id": review.service.id if review.service else None,
                    "product_id": review.product.id if review.product else None,
                    "rating": review.rating,
                    "comment": review.comment,
                },
            },
            status=201,
        )

    return JsonResponse({"error": "Méthode non autorisée."}, status=405)


def review_detail(request, pk):
    review = get_object_or_404(
        Review.objects.select_related("user", "service", "product"),
        pk=pk,
    )

    data = {
        "id": review.id,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at,
        "user": {
            "id": review.user.id,
            "username": review.user.username,
            "full_name": review.user.full_name,
        },
        "service": {
            "id": review.service.id,
            "title": review.service.title,
        } if review.service else None,
        "product": {
            "id": review.product.id,
            "name": review.product.name,
        } if review.product else None,
    }
    return JsonResponse(data)
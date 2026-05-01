from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdminRole

from catalog.models import Service
from rest_framework.response import Response
from rest_framework import status
from marketplace.models import Product
from .models import Review
from accounts.permissions import IsAuthenticatedUser

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@permission_classes([IsAuthenticatedUser])
def reviews_list_create(request):
    if request.method == "GET":
        data = list(
            Review.objects.select_related("user", "service", "product")
            .filter(user=request.user)
            .values(
                "id",
                "rating",
                "comment",
                "created_at",
                "service__id",
                "service__title",
                "product__id",
                "product__name",
            )
        )
        return JsonResponse(data, safe=False)

    payload = request.data
    service_id = payload.get("service_id")
    product_id = payload.get("product_id")
    rating = payload.get("rating")
    comment = payload.get("comment", "")

    if not rating:
        return JsonResponse(
            {"error": "rating est obligatoire."},
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

    service = None
    product = None

    if service_id:
        service = get_object_or_404(Service, pk=service_id)

    if product_id:
        product = get_object_or_404(Product, pk=product_id)

    review = Review.objects.create(
        user=request.user,
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
                "rating": review.rating,
                "comment": review.comment,
                "service_id": review.service.id if review.service else None,
                "product_id": review.product.id if review.product else None,
            },
        },
        status=201,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def review_detail(request, pk):
    review = get_object_or_404(
        Review.objects.select_related("user", "service", "product"),
        pk=pk,
        user=request.user,
    )

    data = {
        "id": review.id,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at,
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

@api_view(["DELETE"])
@permission_classes([IsAdminRole])
def admin_review_delete(request, pk):
    review = get_object_or_404(Review, pk=pk)
    review.delete()
    return Response(
        {"message": "Avis supprimé avec succès."},
        status=status.HTTP_200_OK,
    )
@api_view(["GET"])
def partner_reviews(request, partner_id):
    """Reviews publiques d'un partenaire (via service lié)"""
    reviews = Review.objects.select_related("user", "service").filter(
        service__partner_id=partner_id  # adapte selon ton modèle
    ).order_by("-created_at")

    data = [
        {
            "id": r.id,
            "user_name": r.user.get_full_name() or r.user.username,
            "rating": r.rating,
            "comment": r.comment,
            "date": r.created_at.strftime("%d/%m/%Y"),
        }
        for r in reviews
    ]
    return JsonResponse(data, safe=False)
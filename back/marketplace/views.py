from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from accounts.permissions import IsPartnerOrReadOnly, IsAdminRole
from partners.models import PartnerProfile
from locations.models import Region
from .models import Product, ProductCategory


# =========================
# 🔥 IMAGE HELPER (SIMPLE)
# =========================
def get_image(product):
    return product.image if product.image else None


# =========================
# 🔹 PRODUCTS LIST
# =========================
@api_view(["GET", "POST"])
@permission_classes([IsPartnerOrReadOnly])
def products_list(request):

    # =========================
    # ✅ GET PRODUCTS
    # =========================
    if request.method == "GET":
        queryset = Product.objects.select_related("partner", "category", "region")

        region = request.GET.get("region")
        category = request.GET.get("category")
        q = request.GET.get("q")
        mine = request.GET.get("mine")  # ✅ AJOUT

        if region:
            queryset = queryset.filter(region__slug__icontains=region)

        if category:
            queryset = queryset.filter(category__slug__icontains=category)

        if q:
            queryset = queryset.filter(
                Q(name__icontains=q) |
                Q(description__icontains=q) |
                Q(partner__business_name__icontains=q)
            )

        # ✅ FILTRE PRODUITS DU PARTENAIRE CONNECTÉ
        if mine == "true" and request.user.is_authenticated:
            queryset = queryset.filter(partner__user=request.user)

        data = []

        for p in queryset:
            data.append({
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "price": str(p.price),
                "stock": p.stock,
                "image": get_image(p),
                "is_active": p.is_active,
                "created_at": p.created_at,

                "partner__business_name": p.partner.business_name,

                "category__name": p.category.name if p.category else None,
                "category__slug": p.category.slug if p.category else None,

                "region__name": p.region.name if p.region else None,
                "region__slug": p.region.slug if p.region else None,
            })

        return JsonResponse(data, safe=False)
        # =========================
    # 🔥 POST (FIX)
    # =========================
    if request.method == "POST":

        if not request.user.is_authenticated:
            return Response({"error": "Authentification requise"}, status=401)

        partner = get_object_or_404(PartnerProfile, user=request.user)

        payload = request.data

        name = payload.get("name")
        description = payload.get("description")
        price = payload.get("price")
        stock = payload.get("stock")

        if not name or not price:
            return Response(
                {"error": "name et price sont obligatoires"},
                status=400
            )

        product = Product.objects.create(
            partner=partner,
            name=name,
            description=description,
            price=price,
            stock=stock or 0
        )

        return Response(
            {
                "message": "Produit créé avec succès",
                "product": {
                    "id": product.id,
                    "name": product.name,
                    "price": str(product.price),
                },
            },
            status=201,
        )

# =========================
# 🔹 PRODUCT DETAIL
# =========================
@api_view(["GET", "PATCH", "DELETE"])
def product_detail(request, pk):

    product = get_object_or_404(Product, pk=pk)

    # =========================
    # ✅ GET
    # =========================
    if request.method == "GET":
        return Response({
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": str(product.price),
            "stock": product.stock,
            "image": get_image(product),
        })

    # =========================
    # 🔥 PATCH (UPDATE)
    # =========================
    if request.method == "PATCH":

        # 🔒 sécurité
        if product.partner.user != request.user:
            return Response({"error": "Non autorisé"}, status=403)

        data = request.data

        product.name = data.get("name", product.name)
        product.description = data.get("description", product.description)
        product.price = data.get("price", product.price)
        product.stock = data.get("stock", product.stock)

        product.save()

        return Response({
            "message": "Produit modifié avec succès",
            "product": {
                "id": product.id,
                "name": product.name,
                "price": str(product.price),
            }
        })

    # =========================
    # 🔥 DELETE
    # =========================
    if request.method == "DELETE":

        if product.partner.user != request.user:
            return Response({"error": "Non autorisé"}, status=403)

        product.delete()

        return Response({"message": "Produit supprimé"})


# =========================
# 🔹 ADMIN LIST
# =========================
@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_products_list(request):
    queryset = Product.objects.select_related("partner", "category", "region")

    data = []

    for p in queryset:
        data.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": str(p.price),
            "stock": p.stock,
            "image": get_image(p),  # ✅ DIRECT URL
            "is_active": p.is_active,
            "created_at": p.created_at,

            "partner__id": p.partner.id,
            "partner__business_name": p.partner.business_name,

            "category__id": p.category.id if p.category else None,
            "category__name": p.category.name if p.category else None,

            "region__id": p.region.id if p.region else None,
            "region__name": p.region.name if p.region else None,
        })

    return Response(data, status=status.HTTP_200_OK)


# =========================
# 🔹 TOGGLE
# =========================
def _to_bool(value):
    if isinstance(value, bool):
        return value
    if str(value).lower() in ["true", "1", "yes", "oui"]:
        return True
    if str(value).lower() in ["false", "0", "no", "non"]:
        return False
    return None


@api_view(["PATCH"])
@permission_classes([IsAdminRole])
def admin_product_toggle(request, pk):
    product = get_object_or_404(Product, pk=pk)

    is_active = _to_bool(request.data.get("is_active"))

    if is_active is None:
        return Response(
            {"error": "is_active doit être true ou false."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    product.is_active = is_active
    product.save(update_fields=["is_active"])

    return Response(
        {
            "message": "Statut du produit mis à jour avec succès.",
            "product": {
                "id": product.id,
                "name": product.name,
                "is_active": product.is_active,
            },
        }
    )


# =========================
# 🔹 DELETE
# =========================
@api_view(["DELETE"])
@permission_classes([IsAdminRole])
def admin_product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)
    product.delete()

    return Response(
        {"message": "Produit supprimé avec succès."},
        status=status.HTTP_200_OK,
    )
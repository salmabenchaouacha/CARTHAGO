from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from accounts.permissions import IsAdminRole
from partners.models import PartnerProfile
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer
from django.shortcuts import get_object_or_404
User = get_user_model()


def user_to_dict(user):
    data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "phone": user.phone,
        "role": user.role,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    }

    if user.role == "partner" and hasattr(user, "partner_profile"):
        profile = user.partner_profile
        data["partner_profile"] = {
            "id": profile.id,
            "business_name": profile.business_name,
            "activity_type": profile.activity_type,
            "description": profile.description,
            "address": profile.address,
            "region": profile.region.name if profile.region else None,
            "latitude": str(profile.latitude) if profile.latitude is not None else None,
            "longitude": str(profile.longitude) if profile.longitude is not None else None,
            "is_verified": profile.is_verified,
        }

    return data


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = serializer.save()
    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "message": "Compte créé avec succès.",
            "user": user_to_dict(user),
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        },
        status=status.HTTP_201_CREATED,
    )


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def logout(request):
    # ✅ pas besoin de blacklist
    return Response({"message": "Déconnexion réussie."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({"user": user_to_dict(request.user)}, status=status.HTTP_200_OK)
@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_users_list(request):
    data = list(
        User.objects.values(
            "id",
            "username",
            "email",
            "full_name",
            "phone",
            "role",
            "is_active",
            "is_staff",
            "is_superuser",
            "date_joined",
        )
    )
    return Response(data, status=status.HTTP_200_OK)
@api_view(["PATCH"])
@permission_classes([IsAdminRole])
def admin_user_toggle_active(request, pk):
    user = get_object_or_404(User, pk=pk)

    if "is_active" not in request.data:
        return Response(
            {"error": "Le champ is_active est obligatoire."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    is_active = request.data.get("is_active")

    if isinstance(is_active, str):
        if is_active.lower() in ["true", "1", "yes", "oui"]:
            is_active = True
        elif is_active.lower() in ["false", "0", "no", "non"]:
            is_active = False
        else:
            return Response(
                {"error": "is_active doit être true ou false."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    user.is_active = is_active
    user.save(update_fields=["is_active"])

    return Response(
        {
            "message": "Statut utilisateur mis à jour avec succès.",
            "user": {
                "id": user.id,
                "username": user.username,
                "is_active": user.is_active,
            },
        },
        status=status.HTTP_200_OK,
    )
@api_view(["PATCH"])
@permission_classes([IsAdminRole])
def admin_user_update_role(request, pk):
    user = get_object_or_404(User, pk=pk)

    new_role = request.data.get("role")
    allowed_roles = ["user", "partner", "admin"]

    if not new_role:
        return Response(
            {"error": "Le champ role est obligatoire."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if new_role not in allowed_roles:
        return Response(
            {
                "error": f"Role invalide. Valeurs autorisées : {', '.join(allowed_roles)}."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    user.role = new_role

    if new_role == "admin":
        user.is_staff = True
    else:
        user.is_staff = False

    user.save(update_fields=["role", "is_staff"])

    return Response(
        {
            "message": "Rôle utilisateur mis à jour avec succès.",
            "user": {
                "id": user.id,
                "username": user.username,
                "role": user.role,
                "is_staff": user.is_staff,
            },
        },
        status=status.HTTP_200_OK,
    )
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenObtainPairView

from partners.models import PartnerProfile
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer

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
    refresh_token = request.data.get("refresh")

    if not refresh_token:
        return Response(
            {"error": "Le refresh token est obligatoire."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Déconnexion réussie."}, status=status.HTTP_200_OK)
    except TokenError:
        return Response(
            {"error": "Refresh token invalide ou expiré."},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({"user": user_to_dict(request.user)}, status=status.HTTP_200_OK)
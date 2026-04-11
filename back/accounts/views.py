from django.http import JsonResponse
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return JsonResponse({
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "phone": user.phone,
            "role": user.role,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        }
    })
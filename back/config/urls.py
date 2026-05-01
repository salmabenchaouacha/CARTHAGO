from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path("api/", include("accounts.urls")),
    path("api/", include("locations.urls")),
    path("api/", include("partners.urls")),
    path("api/", include("catalog.urls")),
    path("api/", include("marketplace.urls")),
    path("api/", include("bookings.urls")),
    path("api/", include("reviews.urls")),
    path("api/", include("orders.urls")),
    path("api/", include("dashboards.urls")),
    path('api/ai/', include('ai_travel.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
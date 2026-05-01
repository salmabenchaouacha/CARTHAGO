from django.urls import path
from .views import (
    partners_list,
    partner_detail,
    admin_partners_list,
    admin_partner_verify,
)

urlpatterns = [
    path("partners/", partners_list, name="partners-list"),
    path("partners/<int:pk>/", partner_detail, name="partner-detail"),

    path("admin/partners/", admin_partners_list, name="admin-partners-list"),
    path("admin/partners/<int:pk>/verify/", admin_partner_verify, name="admin-partner-verify"),
]
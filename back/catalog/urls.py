from django.urls import path
from .views import (
    services_list,
    service_detail,
    admin_services_list,
    admin_service_toggle,
    admin_service_delete,
)

urlpatterns = [
    path("services/", services_list, name="services-list"),
    path("services/<int:pk>/", service_detail, name="service-detail"),

    path("admin/services/", admin_services_list, name="admin-services-list"),
    path("admin/services/<int:pk>/toggle/", admin_service_toggle, name="admin-service-toggle"),
    path("admin/services/<int:pk>/delete/", admin_service_delete, name="admin-service-delete"),
]
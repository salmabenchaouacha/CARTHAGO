from django.urls import path
from .views import service_detail, services_list

urlpatterns = [
    path("services/", services_list, name="services-list"),
    path("services/<int:pk>/", service_detail, name="service-detail"),

]
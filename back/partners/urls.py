from django.urls import path
from .views import partner_detail, partners_list

urlpatterns = [
    path("partners/", partners_list, name="partners-list"),
    path("partners/<int:pk>/", partner_detail, name="partner-detail"),

]
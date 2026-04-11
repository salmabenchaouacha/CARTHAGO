from django.urls import path
from .views import region_detail, regions_list

urlpatterns = [
    path("regions/", regions_list, name="regions-list"),
    path("regions/<int:pk>/", region_detail, name="region-detail"),

]
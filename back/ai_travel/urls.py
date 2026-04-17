from django.urls import path
from .views import travel_plan

urlpatterns = [
    path('generate-plan/', travel_plan),
]
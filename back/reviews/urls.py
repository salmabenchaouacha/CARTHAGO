from django.urls import path
from .views import reviews_list_create, review_detail

urlpatterns = [
    path("reviews/", reviews_list_create, name="reviews-list-create"),
    path("reviews/<int:pk>/", review_detail, name="review-detail"),
]
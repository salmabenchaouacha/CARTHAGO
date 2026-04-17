from django.urls import path
from .views import reviews_list_create, review_detail, admin_review_delete

urlpatterns = [
    path("reviews/", reviews_list_create, name="reviews-list-create"),
    path("reviews/<int:pk>/", review_detail, name="review-detail"),

    path("admin/reviews/<int:pk>/delete/", admin_review_delete, name="admin-review-delete"),
]
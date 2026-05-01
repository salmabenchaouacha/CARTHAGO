from django.urls import path
from .views import reviews_list_create, review_detail, admin_review_delete
from .views import partner_reviews  # ← nouveau

urlpatterns = [
    path("reviews/", reviews_list_create, name="reviews-list-create"),
    path("reviews/<int:pk>/", review_detail, name="review-detail"),
    path("partners/<int:partner_id>/reviews/", partner_reviews, name="partner-reviews"),  # ← nouveau
    path("admin/reviews/<int:pk>/delete/", admin_review_delete, name="admin-review-delete"),
]

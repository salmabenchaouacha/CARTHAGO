from django.urls import path
from .views import (
    admin_dashboard,
    partner_dashboard,
    partner_services_list,
    partner_products_list,
    partner_bookings_list,
    partner_orders_list,
    user_dashboard,
    user_bookings_list,
    user_orders_list,
    user_reviews_list,
)

urlpatterns = [
    path("admin/dashboard/", admin_dashboard, name="admin-dashboard"),

    path("partner/dashboard/", partner_dashboard, name="partner-dashboard"),
    path("partner/services/", partner_services_list, name="partner-services-list"),
    path("partner/products/", partner_products_list, name="partner-products-list"),
    path("partner/bookings/", partner_bookings_list, name="partner-bookings-list"),
    path("partner/orders/", partner_orders_list, name="partner-orders-list"),

    path("user/dashboard/", user_dashboard, name="user-dashboard"),
    path("user/bookings/", user_bookings_list, name="user-bookings-list"),
    path("user/orders/", user_orders_list, name="user-orders-list"),
    path("user/reviews/", user_reviews_list, name="user-reviews-list"),
]
from django.urls import path
from .views import (
    orders_list_create,
    order_detail,
    admin_orders_list,
    admin_order_update_status,
)

urlpatterns = [
    path("orders/", orders_list_create, name="orders-list-create"),
    path("orders/<int:pk>/", order_detail, name="order-detail"),

    path("admin/orders/", admin_orders_list, name="admin-orders-list"),
    path("admin/orders/<int:pk>/status/", admin_order_update_status, name="admin-order-update-status"),
]
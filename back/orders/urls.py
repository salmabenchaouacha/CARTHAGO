from django.urls import path
from .views import orders_list_create, order_detail

urlpatterns = [
    path("orders/", orders_list_create, name="orders-list-create"),
    path("orders/<int:pk>/", order_detail, name="order-detail"),
]
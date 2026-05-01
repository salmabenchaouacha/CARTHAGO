from django.urls import path
from .views import (
    products_list,
    product_detail,
    admin_products_list,
    admin_product_toggle,
    admin_product_delete,
)

urlpatterns = [
    path("products/", products_list, name="products-list"),
    path("products/<int:pk>/", product_detail, name="product-detail"),

    path("admin/products/", admin_products_list, name="admin-products-list"),
    path("admin/products/<int:pk>/toggle/", admin_product_toggle, name="admin-product-toggle"),
    path("admin/products/<int:pk>/delete/", admin_product_delete, name="admin-product-delete"),
]
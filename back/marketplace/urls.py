from django.urls import path
from .views import product_detail, products_list

urlpatterns = [
    path("products/", products_list, name="products-list"),
    path("products/<int:pk>/", product_detail, name="product-detail"),

]
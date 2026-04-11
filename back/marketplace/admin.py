from django.contrib import admin
from .models import ProductCategory, Product


@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "partner", "category", "region", "price", "stock", "is_active", "created_at")
    list_filter = ("category", "region", "is_active")
    search_fields = ("name", "partner__business_name", "description")
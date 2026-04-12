from django.urls import path
from .views import register, LoginView, logout, me

urlpatterns = [
    path("auth/register/", register, name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", logout, name="auth-logout"),
    path("auth/me/", me, name="auth-me"),
]
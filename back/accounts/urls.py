from django.urls import path
from .views import (
    register,
    LoginView,
    logout,
    me,
    admin_users_list,
    admin_user_toggle_active,
    admin_user_update_role,
)

urlpatterns = [
    path("auth/register/", register, name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", logout, name="auth-logout"),
    path("auth/me/", me, name="auth-me"),

    path("admin/users/", admin_users_list, name="admin-users-list"),
    path("admin/users/<int:pk>/toggle-active/", admin_user_toggle_active, name="admin-user-toggle-active"),
    path("admin/users/<int:pk>/role/", admin_user_update_role, name="admin-user-update-role"),
]
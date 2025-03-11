from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from debug_toolbar.toolbar import debug_toolbar_urls

from api.admin import cinema_admin_site
from api.views import Register
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("cinema-admin/", cinema_admin_site.urls),
    path("", include("api.urls")),
    path("api/", include("api.urls")),
    path("api/auth/register/" , Register.as_view(), name="register"),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("api/auth/", include("rest_framework.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += debug_toolbar_urls()
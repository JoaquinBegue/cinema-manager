from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from debug_toolbar.toolbar import debug_toolbar_urls

from api.admin import cinema_admin_site

urlpatterns = [
    path("admin/", admin.site.urls),
    path("cinema-admin/", cinema_admin_site.urls),
    path("", include("api.urls")),
    path("api/", include("api.urls")),
    path("auth/", include("api.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += debug_toolbar_urls()
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    # Auth.
    path("auth/", include("auth_api.urls")),

    # Admin.
    path("admin/", include("admin_api.urls")),
    
    # API.
    path("api/", include("api.urls")),

    # Auth.
    path("api-auth/", include("rest_framework.urls")),    
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

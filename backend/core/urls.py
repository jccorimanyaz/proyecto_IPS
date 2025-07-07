from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
    path("auth/", include("djoser.social.urls")),
    path('pool/', include('apps.pools.urls')),

    #path('api/authentication/', include("apps.authentication.urls")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
"""
URL configuration for airspace_restriction_zones project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from users.views import RegistrationView, LoginView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from rest_framework.permissions import AllowAny
from polygon.views import PolygonViewSet, get_map_html
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Airspace restriction zones API",
      default_version='v1',
      description="API for managing restrictions zones",
      contact=openapi.Contact(email="support@example.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
    permission_classes=[AllowAny],
)

router = DefaultRouter()
router.register(r'polygons', PolygonViewSet, basename='polygons')

urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/registration', RegistrationView.as_view(), name='registration'),
    path('api/login', LoginView.as_view(), name='login'),
    path('api/login/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/map/', get_map_html, name='get_map_html')
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

from django.contrib import admin
from .models import Polygon


@admin.register(Polygon)
class PolygonAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'polygon', 'intersection_antimeridian', 'antimeridian_coordinates', 'created_at', 'updated_at')
    search_fields = ('title',)
    list_display_links = None

    def has_add_permission(self, request):
        return False

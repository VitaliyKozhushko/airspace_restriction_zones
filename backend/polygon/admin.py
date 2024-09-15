from django.contrib import admin
from .models import Polygon

@admin.register(Polygon)
class PolygonAdmin(admin.ModelAdmin):
    list_display = ('title', 'intersection_antimeridian', 'created_at', 'updated_at')
    search_fields = ('title',)

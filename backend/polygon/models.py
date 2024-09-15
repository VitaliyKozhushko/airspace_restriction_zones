from django.contrib.gis.db import models as gis_models
from django.db import models
from django.utils import timezone

class Polygon(models.Model):
    title = models.CharField(max_length=255)
    polygon = gis_models.PolygonField()
    intersection_antimeridian = models.BooleanField(default=False)
    antimeridian_coordinates = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

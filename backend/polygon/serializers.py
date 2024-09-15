from rest_framework import serializers
from .models import Polygon
from django.contrib.gis.geos import GEOSGeometry
from shapely.geometry import shape
import json

class PolygonSerializer(serializers.ModelSerializer):
    polygon = serializers.JSONField()

    class Meta:
        model = Polygon
        fields = ['title', 'polygon']

    def to_internal_value(self, data):
        internal_data = super().to_internal_value(data)
        geojson = internal_data.get('polygon', {}).get('geometry')
        if geojson:
            try:
                geom = shape(geojson)
                internal_data['polygon'] = GEOSGeometry(geom.wkt).wkt
            except Exception as e:
                print(f"Error creating geometry from GeoJSON: {e}")
                raise
        return internal_data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        geom = GEOSGeometry(instance.polygon)
        representation['polygon'] = json.loads(geom.geojson)
        return representation

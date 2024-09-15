from rest_framework import serializers
from .models import Polygon

class PolygonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Polygon
        fields = ['title', 'polygon']

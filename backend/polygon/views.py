from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Polygon
from .serializers import PolygonSerializer
from .celery_tasks import calculate_antimeridian

class PolygonViewSet(viewsets.ModelViewSet):
    queryset = Polygon.objects.all()
    serializer_class = PolygonSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        polygon = serializer.save()
        calculate_antimeridian.delay(polygon.id, polygon.polygon.coords[0])

    def get_queryset(self):
        return super().get_queryset()
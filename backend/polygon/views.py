from rest_framework import viewsets, status
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

    def perform_update(self, serializer):
        polygon = serializer.save()
        calculate_antimeridian(polygon.id, polygon.polygon.coords[0])
        return polygon

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()

    def get_queryset(self):
        return Polygon.objects.all().order_by('-id')

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().partial_update(request, *args, **kwargs)
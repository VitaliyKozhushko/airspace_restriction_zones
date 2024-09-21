from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Polygon
from .serializers import PolygonSerializer
from .celery_tasks import calculate_antimeridian
import folium, json
from django.http import JsonResponse
from django.core.cache import cache

class PolygonViewSet(viewsets.ModelViewSet):
    queryset = Polygon.objects.all()
    serializer_class = PolygonSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        polygon = serializer.save()
        calculate_antimeridian.delay(polygon.id, polygon.polygon.coords[0])
        self.clear_cache()

    def perform_update(self, serializer):
        polygon = serializer.save()
        calculate_antimeridian(polygon.id, polygon.polygon.coords[0])
        self.clear_cache()
        return polygon

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()
        self.clear_cache()

    def get_queryset(self):
        return Polygon.objects.all().order_by('-id')

    def list(self, request, *args, **kwargs):
        cache_key = 'polygon_list'
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(json.loads(cached_data), status=status.HTTP_200_OK)

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        cache.set(cache_key, json.dumps(serializer.data), timeout=60 * 15)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().partial_update(request, *args, **kwargs)

    def clear_cache(self):
        cache.delete('polygon_list')

def split_polygon(coords):
    west_coords = []
    east_coords = []

    def add_coords(coords_list, lng, lat):
        coords_list.append((lat, lng))

    for index, (lat, lng) in enumerate(coords):
        if index != len(coords) - 1:
            if lng >= 0:
                add_coords(east_coords, lng, lat)
            else:
                add_coords(west_coords, lng, lat)

    if west_coords and east_coords:
        if west_coords:
            west_coords.insert(0, (west_coords[0][0], -180))
            west_coords.append((west_coords[-1][0], -180))
            west_coords.append((west_coords[0][0], -180))
        if east_coords:
            east_coords.insert(0, (east_coords[0][0], 180))
            east_coords.append((east_coords[-1][0], 180))
            east_coords.append((east_coords[0][0], 180))

    # Если есть только восточные координаты
    if east_coords and not west_coords:
        east_coords.append((east_coords[-1][0], 180))

    # Если есть только западные координаты
    if west_coords and not east_coords:
        west_coords.append((west_coords[-1][0], -180))

    return [[lat, lng] for lat, lng in west_coords], [[lat, lng] for lat, lng in east_coords]

def generate_map():
    m = folium.Map(location=[0, 0], zoom_start=2)

    for polygon in Polygon.objects.all():
        coords = polygon.polygon.coords[0]

        if polygon.intersection_antimeridian:
            west_coords, east_coords = split_polygon(coords)

            # Западная часть полигона
            if west_coords:
                result = folium.Polygon(
                    locations=west_coords,
                    color="red",
                    weight=2,
                    fill=True,
                    fill_opacity=0.6,
                ).add_to(m)
                print(result)
            # Восточная часть полигона
            if east_coords:
                print("Drawing east polygon with coordinates:", east_coords)
                folium.Polygon(
                    locations=east_coords,
                    color="red",
                    weight=2,
                    fill=True,
                    fill_opacity=0.6,
                ).add_to(m)

        else:
            # Обычный полигон
            folium.Polygon(
                locations=[(lat, lng) for lat, lng in coords],
                color="blue",
                weight=2,
                fill=True,
                fill_opacity=0.6,
            ).add_to(m)

    return m

# Генерируем карту с помощью Folium
def get_map_html(request):
    m = generate_map()

    map_html = m._repr_html_()

    return JsonResponse({'map': map_html})
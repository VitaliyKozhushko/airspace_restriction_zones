from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Polygon
from .serializers import PolygonSerializer
from .celery_tasks import calculate_antimeridian
import folium, json
from django.http import JsonResponse
from django.core.cache import cache
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .urls_doc import polygon_structure, polygon_response

class PolygonViewSet(viewsets.ModelViewSet):
    queryset = Polygon.objects.all()
    serializer_class = PolygonSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'delete']

    @swagger_auto_schema(
        operation_description='Создать новый полигон',
        operation_summary='Добавление полигона',
        tags=['Полигоны'],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'title': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Название полигона',
                    example=1
                ),
                'polygon': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'type': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Тип геометрии',
                            example='Polygon'
                        ),
                        'coordinates': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            description='Координаты полигона',
                            items=openapi.Schema(
                                type=openapi.TYPE_ARRAY,
                                items=openapi.Schema(
                                    type=openapi.TYPE_ARRAY,
                                    items=openapi.Schema(type=openapi.TYPE_NUMBER)
                                ),
                                description='Массив точек полигона, каждая точка - это пара координат [широта, долгота]'
                            ),
                            example=[[[10.0, 30.0], [40.0, 40.0], [40.0, 20.0]]]
                        )
                    },
                    description='Поле формата GeoJSON'
                )
            },
            required=['title', 'polygon']
        ),
        responses={
            201: openapi.Response(
                description='Успешное получение списка счетчиков',
                examples={
                    'application/json': polygon_response
                },
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties=polygon_structure
                )
            )
        }
    )
    def create(self, request, *args, **kwargs):
        """
        Создание нового полигона.
        """
        response = super().create(request, *args, **kwargs)
        polygon = self.get_object()
        calculate_antimeridian.delay(polygon.id, polygon.polygon.coords[0])
        self.clear_cache()
        return response

    @swagger_auto_schema(
        operation_description='Обновить существующий полигон',
        operation_summary='Обновление полигона',
        tags=['Полигоны'],
        manual_parameters=[
            openapi.Parameter(
                'id',
                openapi.IN_PATH,
                description='id полигона',
                type=openapi.TYPE_INTEGER
            )
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'title': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Название полигона',
                    example='Title polygon'
                ),
                'polygon': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'type': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Тип геометрии',
                            example='Polygon'
                        ),
                        'coordinates': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            description='Координаты полигона',
                            items=openapi.Schema(
                                type=openapi.TYPE_ARRAY,
                                items=openapi.Schema(
                                    type=openapi.TYPE_ARRAY,
                                    items=openapi.Schema(type=openapi.TYPE_NUMBER)
                                ),
                                description='Массив точек полигона, каждая точка - это пара координат [широта, долгота]'
                            ),
                            example=[[[10.0, 30.0], [40.0, 40.0], [40.0, 20.0]]]
                        )
                    },
                    description='Поле формата GeoJSON'
                )
            },
            required=['title', 'polygon']
        ),
        responses={
            200: openapi.Response(
                description='Успешное обновление полигона',
                examples={
                    'application/json': polygon_response
                },
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties=polygon_structure
                )
            )
        }
    )
    def partial_update(self, request, *args, **kwargs):
        """
        Обновление существующего полигона и сброс кэша
        """
        kwargs['partial'] = True
        response = super().partial_update(request, *args, **kwargs)
        polygon = self.get_object()
        calculate_antimeridian(polygon.id, polygon.polygon.coords[0])
        self.clear_cache()
        return response

    @swagger_auto_schema(
        operation_description='Удалить существующий полигон',
        operation_summary='Удаление полигона',
        tags=['Полигоны'],
        manual_parameters=[
            openapi.Parameter(
                'id',
                openapi.IN_PATH,
                description='id полигона',
                type=openapi.TYPE_INTEGER
            )
        ],
    )
    def destroy(self, request, *args, **kwargs):
        """
        Удаление существующего полигона и очистка кэша
        """
        instance = self.get_object()
        instance.delete()
        self.clear_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        operation_description='Получить список полигонов, с самого нового',
        operation_summary='Список полигонов',
        tags=['Полигоны'],
        responses={
            200: openapi.Response(
                description='Успешное получение списка счетчиков',
                examples={
                    'application/json': [polygon_response]
                },
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties=polygon_structure
                    )
                )
            )
        },
    )
    def list(self, request, *args, **kwargs):
        """
        Возвращает список созданных полигонов с учетом пересечения антимеридиана
        """
        cache_key = 'polygon_list'
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(json.loads(cached_data), status=status.HTTP_200_OK)

        queryset = Polygon.objects.all().order_by('-id')
        serializer = self.get_serializer(queryset, many=True)

        cache.set(cache_key, json.dumps(serializer.data), timeout=60 * 15)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def clear_cache(self):
        """
        Очистка кэша
        """
        cache.delete('polygon_list')

    @swagger_auto_schema(auto_schema=None)
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

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

# Генерация карты с Folium
def get_map_html(request):
    m = generate_map()

    map_html = m._repr_html_()

    return JsonResponse({'map': map_html})
from drf_yasg import openapi

polygon_structure = {
                        'id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID полигона'),
                        'title': openapi.Schema(type=openapi.TYPE_STRING, description='Название полигона'),
                        'polygon': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'type': openapi.Schema(type=openapi.TYPE_STRING, description='Тип геометрии'),
                                'coordinates': openapi.Schema(
                                    type=openapi.TYPE_ARRAY,
                                    items=openapi.Schema(
                                        type=openapi.TYPE_ARRAY,
                                        items=openapi.Schema(
                                            type=openapi.TYPE_ARRAY,
                                            items=openapi.Schema(type=openapi.TYPE_NUMBER)
                                        )
                                    ),
                                    description='Массив точек полигона, где каждая точка это пара координат [широта, долгота]'
                                )
                            },
                            description='Поле формата GeoJSON'
                        ),
                        'intersection_antimeridian': openapi.Schema(type=openapi.TYPE_BOOLEAN,
                                                                    description='Пересекает ли полигон антимеридиан'),
                        'antimeridian_coordinates': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(type=openapi.TYPE_INTEGER),
                            description='Индексы точек в массиве "coordinates", которые пересекают антимеридиан'
                        ),
                        'updated_at': openapi.Schema(type=openapi.TYPE_STRING, format='date-time',
                                                     description='Дата и время последнего обновления')
                    }

polygon_response = {
                        'id': 1,
                        'title': 'Title polygon',
                        'polygon': {
                            "type": "Polygon",
                            "coordinates": [
                                [[69.0, 35.0],
                                 [69.0, 123.0],
                                 [65.0, 111.0],
                                 [69.0, 135.0]]
                            ]
                        },
                        'intersection_antimeridian': 'true',
                        'antimeridian_coordinates': [1, 3],
                        'updated_at': '2024-09-21T15:48:16.891267Z'
                    }
from celery import shared_task
from .models import Polygon
import logging

@shared_task
def calculate_antimeridian(polygon_id, polygon_coordinates):
    logger = logging.getLogger(__name__)
    crosses = False
    antimeridian_coords = []
    logger.info(f'Координаты полигона: {polygon_coordinates}')
    for i in range(len(polygon_coordinates) - 1):
        lon1 = polygon_coordinates[i][1]
        lon2 = polygon_coordinates[i + 1][1]

        if abs(lon1 - lon2) > 180:
            crosses = True

            if polygon_coordinates[i + 1] not in antimeridian_coords:
                antimeridian_coords.append(polygon_coordinates[i + 1])

    polygon = Polygon.objects.get(id=polygon_id)
    logger.info(f'crosses: {crosses}', )
    polygon.intersection_antimeridian = crosses
    polygon.antimeridian_coordinates = antimeridian_coords

    logger.info('Полигон пересекает антимеридиан' if crosses else 'Полигон не пересекает антимеридиан')
    logger.info(f'Координаты пересечения: {antimeridian_coords}')
    logger.info('polygon:', polygon)
    polygon.save()
    logger.info('Полигон успешно сохранен')

from celery import shared_task
from .models import Polygon

@shared_task
def calculate_antimeridian(polygon_id, polygon_coordinates):
    crosses = False
    antimeridian_coords = []

    for i in range(len(polygon_coordinates) - 1):
        lon1 = polygon_coordinates[i][1]
        lon2 = polygon_coordinates[i + 1][1]

        if (lon1 > 0 > lon2) or (lon1 < 0 < lon2):
            crosses = True
            antimeridian_coords.append(i + 1)

    polygon = Polygon.objects.get(id=polygon_id)
    polygon.intersection_antimeridian = crosses
    polygon.antimeridian_coordinates = antimeridian_coords
    polygon.save()
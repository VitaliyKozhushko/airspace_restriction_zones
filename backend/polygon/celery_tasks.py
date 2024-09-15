from celery import shared_task
from .models import Polygon

@shared_task
def calculate_antimeridian(polygon_id, polygon_coordinates):
    crosses = False
    antimeridian_coords = []

    for coord in polygon_coordinates:
        if coord[1] > 180 or coord[1] < -180:
            crosses = True
            antimeridian_coords.append(coord)

    polygon = Polygon.objects.get(id=polygon_id)
    polygon.crosses_antimeridian = crosses
    polygon.antimeridian_coordinates = antimeridian_coords
    polygon.save()

from django.test import TestCase
from unittest.mock import patch
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from polygon.models import Polygon
from rest_framework_simplejwt.tokens import RefreshToken
from polygon.celery_tasks import calculate_antimeridian


class PolygonModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='passwd')

        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

    # Полигон, пересекающий антимеридиан
    def test_polygon_creation_and_antimeridian_crossing(self):
        polygon_coords = [
            (69, 174),
            (69, -150),
            (62, -150),
            (62, 173),
            (69, 174)
        ]
        data = {
            "title": "Test Polygon",
            "polygon": {
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[(lat, lon) for lat, lon in polygon_coords]]
                }
            }
        }
        response = self.client.post('/api/polygons/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        polygon = Polygon.objects.get()
        calculate_antimeridian(polygon.id, polygon.polygon.coords[0])

        polygon.refresh_from_db()
        self.assertTrue(polygon.intersection_antimeridian)
        self.assertTrue(polygon.intersection_antimeridian)

    # Полигон, не пересекающий антимеридиан
    @patch('polygon.views.calculate_antimeridian.delay')
    def test_polygon_does_not_cross_antimeridian(self, mock_calculate_antimeridian):
        polygon_coords = [
            (69, 20),
            (69, 50),
            (62, 51),
            (62, 19),
            (69, 20)
        ]
        data = {
            "title": "Test Polygon No Antimeridian",
            "polygon": {
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[(lat, lon) for lat, lon in polygon_coords]]
                }
            }
        }

        response = self.client.post('/api/polygons/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        polygon = Polygon.objects.get()
        mock_calculate_antimeridian.assert_called_once_with(polygon.id, polygon.polygon.coords[0])
        self.assertFalse(polygon.intersection_antimeridian)

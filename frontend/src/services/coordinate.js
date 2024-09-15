import L from 'leaflet';

export function arrToGeoJSON(coordinates) {
  const swappedCoordinates = coordinates.map(coord => [coord[1], coord[0]]);
  const polygon = L.polygon(swappedCoordinates);
  const geojson = polygon.toGeoJSON();
  return JSON.stringify(geojson);
}
export function transformCoordinate(latitude, longitude) {
  const latitudeNum = parseFloat(latitude);
  const longitudeNum = parseFloat(longitude);
  return [latitudeNum.toFixed(5), longitudeNum.toFixed(5)]
}
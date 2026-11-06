/**
 * Haversine Formula for distance calculation between two latitude/longitude points in meters.
 */
export function calculateDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Validates if the user's GPS coordinates are within the training centre's geofence radius.
 */
export function isWithinGeofence(
  userLat: number,
  userLng: number,
  centreLat: number,
  centreLng: number,
  allowedRadiusMeters: number = 200
): { valid: boolean; distanceMeters: number; allowedRadiusMeters: number } {
  const distance = calculateDistanceInMeters(userLat, userLng, centreLat, centreLng);
  return {
    valid: distance <= allowedRadiusMeters,
    distanceMeters: distance,
    allowedRadiusMeters,
  };
}

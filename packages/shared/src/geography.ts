/**
 * Geography and location utilities
 */

/**
 * Calculates the distance between two points on Earth using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point  
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Interface for parking location data
 */
export interface ParkingWithCoords {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  companyId: string;
  company?: {
    commercialName: string | null;
    legalName: string | null;
  } | null;
}

/**
 * Interface for nearest parking result
 */
export interface NearestParkingResult {
  parking: ParkingWithCoords;
  distanceKm: number;
}

/**
 * Finds the nearest parking to a given location
 */
export function findNearestParking(
  parkings: ParkingWithCoords[],
  userLat: number,
  userLon: number
): NearestParkingResult | null {
  const parkingsWithCoords = parkings.filter(
    p => p.latitude !== null && p.longitude !== null
  ) as (ParkingWithCoords & {
    latitude: number;
    longitude: number;
  })[];

  if (parkingsWithCoords.length === 0) return null;

  let nearest: NearestParkingResult | null = null;
  let minDistance = Infinity;

  for (const parking of parkingsWithCoords) {
    const distance = haversineKm(userLat, userLon, parking.latitude, parking.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { parking, distanceKm: distance };
    }
  }

  return nearest;
}

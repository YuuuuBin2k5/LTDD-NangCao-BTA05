/**
 * Map Clustering Utilities
 * Implements custom clustering for avatars when > 10 friends
 */

export interface ClusterPoint {
  latitude: number;
  longitude: number;
  id: string;
  data: any;
}

export interface Cluster {
  id: string;
  latitude: number;
  longitude: number;
  pointCount: number;
  points: ClusterPoint[];
}

/**
 * Calculate distance between two coordinates in kilometers
 */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate cluster radius based on zoom level
 * Higher zoom = smaller radius (more detailed)
 * Lower zoom = larger radius (more clustering)
 */
export function getClusterRadius(zoom: number): number {
  // Zoom levels: 0 (world) to 20 (building)
  // At zoom 15 (city), use 0.5km radius
  // At zoom 10 (region), use 5km radius
  const baseRadius = 0.5; // km at zoom 15
  const zoomDiff = 15 - zoom;
  return baseRadius * Math.pow(2, zoomDiff);
}

/**
 * Cluster points based on proximity
 * Uses simple distance-based clustering
 */
export function clusterPoints(
  points: ClusterPoint[],
  clusterRadius: number,
  minPointsToCluster: number = 10
): (ClusterPoint | Cluster)[] {
  // If less than threshold, don't cluster
  if (points.length <= minPointsToCluster) {
    return points;
  }

  const clusters: Cluster[] = [];
  const processed = new Set<string>();

  points.forEach((point) => {
    if (processed.has(point.id)) return;

    // Find nearby points
    const nearbyPoints = points.filter((p) => {
      if (processed.has(p.id) || p.id === point.id) return false;
      const distance = getDistance(point.latitude, point.longitude, p.latitude, p.longitude);
      return distance <= clusterRadius;
    });

    if (nearbyPoints.length > 0) {
      // Create cluster
      const clusterPoints = [point, ...nearbyPoints];
      const avgLat = clusterPoints.reduce((sum, p) => sum + p.latitude, 0) / clusterPoints.length;
      const avgLon = clusterPoints.reduce((sum, p) => sum + p.longitude, 0) / clusterPoints.length;

      clusters.push({
        id: `cluster-${point.id}`,
        latitude: avgLat,
        longitude: avgLon,
        pointCount: clusterPoints.length,
        points: clusterPoints,
      });

      // Mark as processed
      processed.add(point.id);
      nearbyPoints.forEach((p) => processed.add(p.id));
    } else {
      // Single point, no cluster
      processed.add(point.id);
    }
  });

  // Add remaining unprocessed points
  const unclustered = points.filter((p) => !processed.has(p.id));

  return [...clusters, ...unclustered];
}

/**
 * Check if a point is within the visible map region
 */
export function isPointInRegion(
  point: { latitude: number; longitude: number },
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }
): boolean {
  const latMin = region.latitude - region.latitudeDelta / 2;
  const latMax = region.latitude + region.latitudeDelta / 2;
  const lonMin = region.longitude - region.longitudeDelta / 2;
  const lonMax = region.longitude + region.longitudeDelta / 2;

  return (
    point.latitude >= latMin &&
    point.latitude <= latMax &&
    point.longitude >= lonMin &&
    point.longitude <= lonMax
  );
}

/**
 * Filter points to only those visible in the current region
 * Adds a buffer to include points just outside the viewport
 */
export function getVisiblePoints<T extends { latitude: number; longitude: number }>(
  points: T[],
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  },
  bufferFactor: number = 1.2 // 20% buffer
): T[] {
  const bufferedRegion = {
    ...region,
    latitudeDelta: region.latitudeDelta * bufferFactor,
    longitudeDelta: region.longitudeDelta * bufferFactor,
  };

  return points.filter((point) => isPointInRegion(point, bufferedRegion));
}

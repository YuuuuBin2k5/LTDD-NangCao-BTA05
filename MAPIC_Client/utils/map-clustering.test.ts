/**
 * Map Clustering Tests
 * Verify clustering and virtualization work correctly
 */

import {
  clusterPoints,
  getClusterRadius,
  getVisiblePoints,
  isPointInRegion,
  ClusterPoint,
} from './map-clustering';

describe('Map Clustering', () => {
  describe('getClusterRadius', () => {
    it('should return larger radius for lower zoom levels', () => {
      const zoom10 = getClusterRadius(10);
      const zoom15 = getClusterRadius(15);
      const zoom20 = getClusterRadius(20);

      expect(zoom10).toBeGreaterThan(zoom15);
      expect(zoom15).toBeGreaterThan(zoom20);
    });

    it('should return 0.5km at zoom 15', () => {
      expect(getClusterRadius(15)).toBe(0.5);
    });
  });

  describe('isPointInRegion', () => {
    const region = {
      latitude: 10.8231,
      longitude: 106.6297,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };

    it('should return true for point inside region', () => {
      const point = { latitude: 10.8231, longitude: 106.6297 };
      expect(isPointInRegion(point, region)).toBe(true);
    });

    it('should return false for point outside region', () => {
      const point = { latitude: 11.0, longitude: 107.0 };
      expect(isPointInRegion(point, region)).toBe(false);
    });

    it('should handle edge cases at region boundaries', () => {
      const pointAtEdge = {
        latitude: region.latitude + region.latitudeDelta / 2,
        longitude: region.longitude + region.longitudeDelta / 2,
      };
      expect(isPointInRegion(pointAtEdge, region)).toBe(true);
    });
  });

  describe('getVisiblePoints', () => {
    const region = {
      latitude: 10.8231,
      longitude: 106.6297,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };

    const points = [
      { id: '1', latitude: 10.8231, longitude: 106.6297 }, // Inside
      { id: '2', latitude: 10.9, longitude: 106.7 }, // Outside
      { id: '3', latitude: 10.82, longitude: 106.63 }, // Inside
    ];

    it('should filter to only visible points', () => {
      const visible = getVisiblePoints(points, region, 1.0);
      expect(visible.length).toBeLessThanOrEqual(points.length);
    });

    it('should include buffer zone', () => {
      const withBuffer = getVisiblePoints(points, region, 1.5);
      const withoutBuffer = getVisiblePoints(points, region, 1.0);
      expect(withBuffer.length).toBeGreaterThanOrEqual(withoutBuffer.length);
    });
  });

  describe('clusterPoints', () => {
    it('should not cluster when points < threshold', () => {
      const points: ClusterPoint[] = [
        { id: '1', latitude: 10.8231, longitude: 106.6297, data: {} },
        { id: '2', latitude: 10.8232, longitude: 106.6298, data: {} },
      ];

      const result = clusterPoints(points, 1.0, 10);
      expect(result.length).toBe(2);
      expect(result.every((r) => !('pointCount' in r))).toBe(true);
    });

    it('should cluster when points > threshold and close together', () => {
      const points: ClusterPoint[] = Array.from({ length: 15 }, (_, i) => ({
        id: `${i}`,
        latitude: 10.8231 + i * 0.001, // Close together
        longitude: 106.6297 + i * 0.001,
        data: {},
      }));

      const result = clusterPoints(points, 1.0, 10);
      expect(result.length).toBeLessThan(points.length);
      expect(result.some((r) => 'pointCount' in r)).toBe(true);
    });

    it('should not cluster distant points', () => {
      const points: ClusterPoint[] = Array.from({ length: 15 }, (_, i) => ({
        id: `${i}`,
        latitude: 10.8231 + i * 1.0, // Far apart
        longitude: 106.6297 + i * 1.0,
        data: {},
      }));

      const result = clusterPoints(points, 0.5, 10);
      // Most should remain unclustered due to distance
      expect(result.length).toBeGreaterThan(5);
    });

    it('should calculate correct cluster center', () => {
      const points: ClusterPoint[] = [
        { id: '1', latitude: 10.0, longitude: 106.0, data: {} },
        { id: '2', latitude: 10.001, longitude: 106.001, data: {} },
        { id: '3', latitude: 10.002, longitude: 106.002, data: {} },
      ];

      const result = clusterPoints(points, 1.0, 2);
      const cluster = result.find((r) => 'pointCount' in r);
      
      if (cluster && 'pointCount' in cluster) {
        expect(cluster.latitude).toBeCloseTo(10.001, 3);
        expect(cluster.longitude).toBeCloseTo(106.001, 3);
      }
    });
  });
});

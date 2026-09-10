import { describe, it, expect } from 'vitest';
import {
  calculateHaversineDistance,
  extractCoordsFromGoogleMapsUrl,
} from '../../src/routes/cod.routes.js';

describe('Geofencing & Haversine Distance Unit Tests (PRD 7.3 & 14.1)', () => {
  // Atelier coordinates in Depok (Margonda Raya)
  const ATELIER = { lat: -6.3728, lon: 106.8315, maxRadiusKm: 5.0 };

  it('should return 0 km for identical coordinates', () => {
    const dist = calculateHaversineDistance(ATELIER.lat, ATELIER.lon, ATELIER.lat, ATELIER.lon);
    expect(dist).toBe(0);
  });

  it('should accurately calculate distance to nearby popular COD spots within 5.0 KM (Free Shipping)', () => {
    // Gerbatama UI (-6.3688, 106.8336)
    const gerbatamaDist = calculateHaversineDistance(ATELIER.lat, ATELIER.lon, -6.3688, 106.8336);
    expect(gerbatamaDist).toBeLessThanOrEqual(5.0);
    expect(gerbatamaDist).toBeGreaterThan(0.2);

    // Margo City Mall (-6.3732, 106.8344)
    const margoCityDist = calculateHaversineDistance(ATELIER.lat, ATELIER.lon, -6.3732, 106.8344);
    expect(margoCityDist).toBeLessThanOrEqual(5.0);
    expect(margoCityDist).toBeLessThan(1.0);

    // D'Mall Margonda (-6.3907, 106.8286)
    const dmallDist = calculateHaversineDistance(ATELIER.lat, ATELIER.lon, -6.3907, 106.8286);
    expect(dmallDist).toBeLessThanOrEqual(5.0);
  });

  it('should detect when location exceeds 5.0 KM threshold (Paid Delivery)', () => {
    // Monas Jakarta (-6.1754, 106.8272)
    const monasDist = calculateHaversineDistance(ATELIER.lat, ATELIER.lon, -6.1754, 106.8272);
    expect(monasDist).toBeGreaterThan(5.0);
    expect(monasDist).toBeGreaterThan(20.0);

    // Kebun Raya Bogor (-6.5976, 106.7996)
    const bogorDist = calculateHaversineDistance(ATELIER.lat, ATELIER.lon, -6.5976, 106.7996);
    expect(bogorDist).toBeGreaterThan(5.0);
    expect(bogorDist).toBeGreaterThan(20.0);
  });

  it('should parse coordinates from standard Google Maps URLs with @-notation', () => {
    const url = 'https://www.google.com/maps/place/Gerbatama+UI/@-6.3688,106.8336,17z';
    const coords = extractCoordsFromGoogleMapsUrl(url);

    expect(coords).not.toBeNull();
    expect(coords?.latitude).toBeCloseTo(-6.3688, 4);
    expect(coords?.longitude).toBeCloseTo(106.8336, 4);
  });

  it('should parse coordinates from Google Maps query parameter (?q=lat,lon)', () => {
    const url = 'https://maps.google.com/?q=-6.3732,106.8344';
    const coords = extractCoordsFromGoogleMapsUrl(url);

    expect(coords).not.toBeNull();
    expect(coords?.latitude).toBeCloseTo(-6.3732, 4);
    expect(coords?.longitude).toBeCloseTo(106.8344, 4);
  });

  it('should parse coordinates from Google Maps ll parameter (ll=lat,lon)', () => {
    const url = 'https://maps.google.com/?ll=-6.3907,106.8286';
    const coords = extractCoordsFromGoogleMapsUrl(url);

    expect(coords).not.toBeNull();
    expect(coords?.latitude).toBeCloseTo(-6.3907, 4);
    expect(coords?.longitude).toBeCloseTo(106.8286, 4);
  });

  it('should return null for malformed or empty URLs', () => {
    expect(extractCoordsFromGoogleMapsUrl('')).toBeNull();
    expect(extractCoordsFromGoogleMapsUrl('https://google.com/search?q=chenille')).toBeNull();
    expect(extractCoordsFromGoogleMapsUrl('invalid-url-string')).toBeNull();
  });
});

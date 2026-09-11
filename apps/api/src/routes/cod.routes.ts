import { Router, Request, Response } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// Default Atelier Reference Location (Jl. Margonda Raya No. 108 Depok) fallback
const DEFAULT_ATELIER_COORDS = {
  latitude: -6.3728,
  longitude: 106.8315,
  max_free_radius_km: 5.0,
};

// Retrieve dynamic atelier coordinates & COD radius from store_settings
export async function getAtelierCoords(): Promise<{ latitude: number; longitude: number; max_free_radius_km: number }> {
  try {
    const result = await pool.query(
      `SELECT latitude, longitude, max_cod_radius_km FROM store_settings WHERE id = 'atelier_setting' LIMIT 1;`
    );
    if (result.rows.length > 0 && result.rows[0].latitude && result.rows[0].longitude) {
      const lat = parseFloat(result.rows[0].latitude);
      const lon = parseFloat(result.rows[0].longitude);
      const radius = result.rows[0].max_cod_radius_km ? parseFloat(result.rows[0].max_cod_radius_km) : 5.0;
      if (!isNaN(lat) && !isNaN(lon)) {
        return {
          latitude: lat,
          longitude: lon,
          max_free_radius_km: !isNaN(radius) ? radius : 5.0,
        };
      }
    }
  } catch (err) {
    console.warn('Failed to query dynamic atelier coordinates from store_settings, falling back to defaults:', err);
  }
  return DEFAULT_ATELIER_COORDS;
}

// Haversine formula to calculate great-circle distance between two points in km
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Extract Latitude & Longitude from various Google Maps URL formats
export function extractCoordsFromGoogleMapsUrl(url: string): { latitude: number; longitude: number } | null {
  if (!url) return null;

  // Format: @-6.3688,106.8336,17z
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    return {
      latitude: parseFloat(atMatch[1]),
      longitude: parseFloat(atMatch[2]),
    };
  }

  // Format: ?q=-6.3688,106.8336 or &q=-6.3688,106.8336
  const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) {
    return {
      latitude: parseFloat(qMatch[1]),
      longitude: parseFloat(qMatch[2]),
    };
  }

  // Format: ll=-6.3688,106.8336
  const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (llMatch) {
    return {
      latitude: parseFloat(llMatch[1]),
      longitude: parseFloat(llMatch[2]),
    };
  }

  return null;
}

// GET /api/v1/cod-points
// Fetch all active COD meetup points with dynamic geofencing status
router.get('/', async (req: Request, res: Response) => {
  try {
    const atelierCoords = await getAtelierCoords();
    const result = await pool.query(
      `SELECT id, name, full_address, google_maps_url, distance_km::float as distance_km,
              latitude::float as latitude, longitude::float as longitude, delivery_notes, is_active
       FROM cod_meetup_points
       WHERE is_active = true
       ORDER BY distance_km ASC;`
    );

    const points = result.rows.map((row: any) => ({
      ...row,
      is_free_shipping: row.distance_km <= atelierCoords.max_free_radius_km,
      delivery_fee: row.distance_km <= atelierCoords.max_free_radius_km ? 0 : 10000,
    }));

    return res.json({
      success: true,
      data: points,
      atelier_origin: atelierCoords,
    });
  } catch (error: any) {
    console.error('Error fetching COD points:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data titik COD.' });
  }
});

// POST /api/v1/cod-points/calculate-distance
// Calculate distance from Atelier and determine dynamic Free Shipping geofence
router.post('/calculate-distance', async (req: Request, res: Response) => {
  try {
    let { latitude, longitude, google_maps_url } = req.body;

    if ((latitude === undefined || longitude === undefined) && google_maps_url) {
      const extracted = extractCoordsFromGoogleMapsUrl(google_maps_url);
      if (extracted) {
        latitude = extracted.latitude;
        longitude = extracted.longitude;
      }
    }

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Koordinat latitude/longitude atau URL Google Maps yang valid wajib disertakan.',
      });
    }

    const atelierCoords = await getAtelierCoords();
    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);
    const distanceKm = calculateHaversineDistance(
      atelierCoords.latitude,
      atelierCoords.longitude,
      latNum,
      lonNum
    );

    const isFreeShipping = distanceKm <= atelierCoords.max_free_radius_km;

    return res.json({
      success: true,
      data: {
        destination: { latitude: latNum, longitude: lonNum },
        atelier_origin: atelierCoords,
        distance_km: distanceKm,
        is_free_shipping: isFreeShipping,
        max_radius_km: atelierCoords.max_free_radius_km,
        delivery_fee: isFreeShipping ? 0 : 10000,
        message: isFreeShipping
          ? `Bebas Biaya Antar! Lokasi berjarak ${distanceKm} KM dari atelier (di dalam radius ${atelierCoords.max_free_radius_km} KM).`
          : `Di luar radius bebas ongkir (${distanceKm} KM > ${atelierCoords.max_free_radius_km} KM). Biaya penyerahan COD: Rp 10.000.`,
      },
    });
  } catch (error: any) {
    console.error('Error calculating distance:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal menghitung jarak.' });
  }
});

// POST /api/v1/cod-points
// Add new verified COD point with auto-distance calculation
router.post('/', async (req: Request, res: Response) => {
  try {
    let { name, full_address, google_maps_url, distance_km, latitude, longitude, delivery_notes } = req.body;
    if (!name || !full_address || !google_maps_url) {
      return res.status(400).json({ success: false, error: 'Nama, alamat, dan link Google Maps wajib diisi.' });
    }

    // Auto-extract coordinates if missing
    if ((latitude === undefined || longitude === undefined) && google_maps_url) {
      const extracted = extractCoordsFromGoogleMapsUrl(google_maps_url);
      if (extracted) {
        latitude = extracted.latitude;
        longitude = extracted.longitude;
      }
    }

    const atelierCoords = await getAtelierCoords();

    // Auto-calculate distance if missing and coords are present
    if ((distance_km === undefined || distance_km === null) && latitude && longitude) {
      distance_km = calculateHaversineDistance(
        atelierCoords.latitude,
        atelierCoords.longitude,
        parseFloat(latitude),
        parseFloat(longitude)
      );
    }

    const id = `cod-${Date.now()}`;
    const insertSql = `
      INSERT INTO cod_meetup_points (id, name, full_address, google_maps_url, distance_km, latitude, longitude, delivery_notes, is_active, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())
      RETURNING *;
    `;
    const result = await pool.query(insertSql, [
      id,
      name,
      full_address,
      google_maps_url,
      distance_km || 2.5,
      latitude || -6.3688,
      longitude || 106.8336,
      delivery_notes || null,
    ]);

    const createdPoint = {
      ...result.rows[0],
      is_free_shipping: (result.rows[0].distance_km || 0) <= atelierCoords.max_free_radius_km,
    };

    return res.json({ success: true, data: createdPoint, message: 'Titik temu COD berhasil disimpan.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/cod-points/:id
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const allowed = ['name', 'full_address', 'google_maps_url', 'distance_km', 'delivery_notes', 'latitude', 'longitude', 'is_active'];
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const f of allowed) {
      if (body[f] !== undefined) {
        updates.push(`${f} = $${idx}`);
        values.push(body[f]);
        idx++;
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'Tidak ada perubahan.' });
    }

    values.push(id);
    const sql = `
      UPDATE cod_meetup_points
      SET ${updates.join(', ')}
      WHERE id = $${idx}
      RETURNING *;
    `;
    const result = await pool.query(sql, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Titik COD tidak ditemukan.' });
    }

    return res.json({ success: true, data: result.rows[0], message: 'Titik COD berhasil diperbarui.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/v1/cod-points/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM cod_meetup_points WHERE id = $1 RETURNING id;`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Titik COD tidak ditemukan.' });
    }
    return res.json({ success: true, message: 'Titik COD berhasil dihapus.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET /api/v1/cod-points
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, full_address, google_maps_url, distance_km::float as distance_km,
              latitude::float as latitude, longitude::float as longitude, delivery_notes, is_active
       FROM cod_meetup_points
       WHERE is_active = true
       ORDER BY distance_km ASC;`
    );
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error('Error fetching COD points:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data titik COD.' });
  }
});

// POST /api/v1/cod-points
router.post('/', async (req, res) => {
  try {
    const { name, full_address, google_maps_url, distance_km, latitude, longitude, delivery_notes } = req.body;
    if (!name || !full_address || !google_maps_url) {
      return res.status(400).json({ success: false, error: 'Nama, alamat, dan link Google Maps wajib diisi.' });
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

    return res.json({ success: true, data: result.rows[0], message: 'Titik temu COD berhasil disimpan.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/cod-points/:id
router.patch('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

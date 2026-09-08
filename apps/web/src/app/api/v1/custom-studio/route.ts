import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query(`
      SELECT id, category, name, description, price_modifier::float as price_modifier,
             emoji_or_icon, hex_color, sort_order, is_active
      FROM custom_studio_options
      WHERE is_active = true
      ORDER BY sort_order ASC;
    `);

    // Group by category
    const options = res.rows;
    const grouped: Record<string, any[]> = {
      FLOWER_TYPE: [],
      CHENILLE_COLOR: [],
      WRAPPING_STYLE: [],
      RIBBON_STYLE: [],
      ACCESSORY_ADDON: [],
    };

    options.forEach((opt) => {
      if (grouped[opt.category]) {
        grouped[opt.category].push(opt);
      } else {
        grouped[opt.category] = [opt];
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        raw: options,
        grouped,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil opsi custom studio.' }, { status: 500 });
  }
}

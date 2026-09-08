import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      const messagesRes = await query(
        `SELECT id, session_id, sender, text, attachment_url, sent_at
         FROM chat_messages
         WHERE session_id = $1
         ORDER BY sent_at ASC;`,
        [sessionId]
      );
      return NextResponse.json({ success: true, data: messagesRes.rows });
    }

    // Admin view: list all active sessions
    const sessionsRes = await query(`
      SELECT 
        s.id,
        s.guest_name,
        s.guest_email,
        s.is_escalated_wa,
        s.created_at,
        s.updated_at,
        (SELECT text FROM chat_messages WHERE session_id = s.id ORDER BY sent_at DESC LIMIT 1) as last_message,
        (SELECT sent_at FROM chat_messages WHERE session_id = s.id ORDER BY sent_at DESC LIMIT 1) as last_message_at
      FROM chat_sessions s
      ORDER BY s.updated_at DESC
      LIMIT 20;
    `);

    return NextResponse.json({ success: true, data: sessionsRes.rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal memuat pesan chat.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, guest_name = 'Pengunjung Web', sender = 'CUSTOMER', text, attachment_url } = body;

    if (!text && !attachment_url) {
      return NextResponse.json({ success: false, error: 'Teks pesan wajib diisi.' }, { status: 400 });
    }

    const activeSessionId = session_id || `chat-${Date.now()}`;

    // Ensure session exists
    await query(
      `INSERT INTO chat_sessions (id, guest_name, is_active, created_at, updated_at)
       VALUES ($1, $2, true, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET updated_at = NOW();`,
      [activeSessionId, guest_name]
    );

    // Save message
    const msgRes = await query(
      `INSERT INTO chat_messages (session_id, sender, text, attachment_url, sent_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *;`,
      [activeSessionId, sender, text, attachment_url || null]
    );

    let botReply: any = null;

    // Automated smart bot assistant response if sender is CUSTOMER
    if (sender === 'CUSTOMER') {
      const lower = text.toLowerCase();
      let replyText = 'Terima kasih telah menghubungi Chenille Flowers Atelier! Florist kami akan segera merespons obrolan Anda. Untuk konsultasi desain khusus secara langsung, Anda juga dapat mengalihkan ke WhatsApp kami.';

      if (lower.includes('garansi') || lower.includes('rusak') || lower.includes('patah')) {
        replyText = '🛡️ Kebijakan Garansi 100%: Jangan khawatir! Jika buket Anda rusak dalam pengiriman, cukup kirimkan video unboxing 1x24 jam via portal pelacakan dan kami ganti buket baru GRATIS tanpa perlu retur!';
      } else if (lower.includes('cod') || lower.includes('titik') || lower.includes('ketemu')) {
        replyText = '📍 Titik Temu COD Kampus & Mall: Kami melayani COD di Gerbatama UI, Stasiun Pocin, Margo City, Gunadarma D, dan D\'Mall. Radius 5.0 KM dari Margonda Atelier GRATIS ongkir!';
      } else if (lower.includes('po') || lower.includes('lama') || lower.includes('hari')) {
        replyText = '⏰ Waktu Pengerjaan: Buket ready stock dikirim di hari yang sama. Untuk buket kustom wisuda (PO) membutuhkan 1-3 hari kerja.';
      } else if (lower.includes('qris') || lower.includes('bayar') || lower.includes('rekening')) {
        replyText = '💳 Pembayaran: Kami menerima pembayaran otomatis melalui Midtrans Snap QRIS (GoPay/ShopeePay) dan transfer Bank BCA manual.';
      }

      const botRes = await query(
        `INSERT INTO chat_messages (session_id, sender, text, sent_at)
         VALUES ($1, 'BOT', $2, NOW())
         RETURNING *;`,
        [activeSessionId, replyText]
      );
      botReply = botRes.rows[0];
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId: activeSessionId,
        message: msgRes.rows[0],
        botReply,
      },
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengirim pesan chat.' }, { status: 500 });
  }
}

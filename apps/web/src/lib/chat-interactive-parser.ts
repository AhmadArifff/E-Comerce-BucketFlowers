/**
 * Chat Interactive Parser
 * Utility for parsing and formatting interactive action tags and mini product cards in CS chats
 */

export interface ParsedProductTag {
  id: string;
  name: string;
}

export interface ParsedActionTag {
  type: 'OPEN_STUDIO' | 'TRACK_ORDER' | 'VIEW_COD' | 'VIEW_CATALOG' | 'VIEW_WARRANTY' | string;
  label: string;
  params: Record<string, string>;
}

export interface ParsedChatMessage {
  cleanText: string;
  products: ParsedProductTag[];
  actions: ParsedActionTag[];
  rawText: string;
}

/**
 * Parse raw chat text and extract product tags & action tags
 */
export function parseInteractiveChat(text: string): ParsedChatMessage {
  if (!text) {
    return { cleanText: '', products: [], actions: [], rawText: '' };
  }

  const products: ParsedProductTag[] = [];
  const actions: ParsedActionTag[] = [];

  // Extract products: [[product:id|name]]
  const productRegex = /\[\[product:([^|\]]+)\|([^\]]+)\]\]/g;
  let prodMatch: RegExpExecArray | null;
  while ((prodMatch = productRegex.exec(text)) !== null) {
    products.push({
      id: prodMatch[1].trim(),
      name: prodMatch[2].trim(),
    });
  }

  // Extract actions: [[action:TYPE?params|label]]
  const actionRegex = /\[\[action:([a-zA-Z0-9_-]+)(?:\?([^|\]]+))?\|([^\]]+)\]\]/g;
  let actMatch: RegExpExecArray | null;
  while ((actMatch = actionRegex.exec(text)) !== null) {
    const rawType = actMatch[1];
    const rawQuery = actMatch[2] || '';
    const label = actMatch[3].trim();

    const params: Record<string, string> = {};
    if (rawQuery) {
      const parts = rawQuery.split('&');
      for (const part of parts) {
        const [k, v] = part.split('=');
        if (k) params[k] = decodeURIComponent(v || '');
      }
    }

    actions.push({
      type: rawType,
      label,
      params,
    });
  }

  // Clean text by stripping [[product:...]] and [[action:...]]
  const cleanText = text
    .replace(/\[\[product:[^\]]+\]\]/g, '')
    .replace(/\[\[action:[^\]]+\]\]/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    cleanText,
    products,
    actions,
    rawText: text,
  };
}

/**
 * Format interactive text into human-readable WhatsApp text with clickable deep links
 */
export function formatChatForWhatsApp(text: string, baseUrl: string = ''): string {
  if (!text) return '';

  const host = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');

  let waText = text;

  // Replace product tags with readable WhatsApp text
  waText = waText.replace(/\[\[product:([^|\]]+)\|([^\]]+)\]\]/g, (_, id, name) => {
    return `\n👉 *Pesan Buket:* ${name.trim()} (${host}/#katalog)`;
  });

  // Replace action tags with readable deep links
  waText = waText.replace(/\[\[action:([a-zA-Z0-9_-]+)(?:\?([^|\]]+))?\|([^\]]+)\]\]/g, (_, type, query, label) => {
    let link = `${host}/`;
    if (type === 'OPEN_STUDIO') link = `${host}/#custom-studio`;
    else if (type === 'VIEW_COD') link = `${host}/#cod-meetup`;
    else if (type === 'VIEW_CATALOG') link = `${host}/#katalog`;
    else if (type === 'VIEW_WARRANTY') link = `${host}/#garansi`;
    else if (type === 'TRACK_ORDER') {
      const inv = query ? new URLSearchParams(query).get('inv') : '';
      link = inv ? `${host}/lacak-pesanan?inv=${inv}` : `${host}/lacak-pesanan`;
    }
    return `\n👉 *${label.trim()}:* ${link}`;
  });

  return waText.trim();
}

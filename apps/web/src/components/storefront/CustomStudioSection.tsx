'use client';

import React, { useState } from 'react';
import { Sparkles, MessageCircle, ShoppingBag, Check, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { flyToCart, showMagicToast } from '@/lib/magic-motion';

interface FlowerOpt {
  id: string;
  name: string;
  emoji: string;
  basePrice: number;
}

interface ColorOpt {
  id: string;
  name: string;
  colorHex: string;
}

interface WrappingOpt {
  id: string;
  name: string;
  desc: string;
}

interface AddonOpt {
  id: string;
  name: string;
  price: number;
  icon: string;
}

const FLOWERS: FlowerOpt[] = [
  { id: 'tulip', name: 'Tulip Cantik', emoji: '🌷', basePrice: 120000 },
  { id: 'rose', name: 'Mawar Velvet', emoji: '🌹', basePrice: 130000 },
  { id: 'sunflower', name: 'Bunga Matahari', emoji: '🌻', basePrice: 115000 },
  { id: 'lavender', name: 'Lavender Harum', emoji: '🪻', basePrice: 125000 },
];

const COLORS: ColorOpt[] = [
  { id: 'pink', name: 'Pastel Pink', colorHex: '#F4A7B9' },
  { id: 'lilac', name: 'Lavender Lilac', colorHex: '#C4B5FD' },
  { id: 'blue', name: 'Sky Blue', colorHex: '#BAE6FD' },
  { id: 'sage', name: 'Matcha Sage', colorHex: '#A8C3A0' },
];

const WRAPPINGS: WrappingOpt[] = [
  { id: 'korean_pink', name: 'Korean Two-Tone Pink', desc: 'Cellophane matte lembut' },
  { id: 'lilac_white', name: 'Lilac & White Velvet', desc: 'Aksen beludru elegan' },
  { id: 'clean_oat', name: 'Minimalist Clean Oat', desc: 'Nuansa earth tone aesthetic' },
];

const ADDONS: AddonOpt[] = [
  { id: 'led', name: 'Lampu LED Fairy Light', price: 10000, icon: '💡' },
  { id: 'bear', name: 'Boneka Toga Wisuda Mini', price: 15000, icon: '🧸' },
  { id: 'card', name: 'Kartu Ucapan Kaligrafi Custom', price: 5000, icon: '💌' },
];

export const CustomStudioSection: React.FC = () => {
  const { addItem, setIsCartOpen } = useCartStore();
  const [selectedFlower, setSelectedFlower] = useState<FlowerOpt>(FLOWERS[0]);
  const [selectedColor, setSelectedColor] = useState<ColorOpt>(COLORS[0]);
  const [selectedWrapping, setSelectedWrapping] = useState<WrappingOpt>(WRAPPINGS[0]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['led']);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const found = ADDONS.find((a) => a.id === addonId);
    return sum + (found ? found.price : 0);
  }, 0);

  const totalPrice = selectedFlower.basePrice + addonsTotal;

  const handleWhatsAppOrder = () => {
    const activeAddonNames = selectedAddons
      .map((id) => ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const message = `Halo Atelier Chenille Flowers! 🌸
Saya ingin memesan Custom Buket Kawat Bulu dengan detail:
- Bunga Utama: ${selectedFlower.name} (${selectedFlower.emoji})
- Warna Kawat Bulu: ${selectedColor.name}
- Kertas Wrapping: ${selectedWrapping.name}
- Aksesori Tambahan: ${activeAddonNames || 'Tanpa Aksesori Tambahan'}
- Estimasi Harga: Rp ${totalPrice.toLocaleString('id-ID')}

Apakah slot antrean perangkaian masih tersedia untuk pengiriman segera? Terima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/6281298317721?text=${encoded}`, '_blank');
  };

  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      flyToCart(e.currentTarget, selectedFlower.emoji);
    }
    const activeAddonNames = selectedAddons
      .map((id) => ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    addItem({
      id: `custom-${Date.now()}`,
      slug: `custom-${selectedFlower.id}-${selectedColor.id}`,
      name: `Custom Buket ${selectedFlower.name} (${selectedColor.name})`,
      price: totalPrice,
      rawCostHpp: Math.round(totalPrice * 0.45),
      image: '/preview-tema-a.jpg',
      category: 'CUSTOM',
      description: `Buket custom ${selectedFlower.name} (${selectedColor.name}) dengan wrapping ${selectedWrapping.name}${activeAddonNames ? ' dan aksesori: ' + activeAddonNames : ''}.`,
      stock: 10,
      isReadyStock: false,
      isActive: true,
      poLeadDays: 2,
      clickCount: 1,
      rating: 5.0,
      reviewCount: 1,
    });

    showMagicToast(
      'Buket Custom Ditambahkan! ✨',
      `${selectedFlower.name} (${selectedColor.name}) - Rp ${totalPrice.toLocaleString('id-ID')}`,
      selectedFlower.emoji,
      'Lihat Keranjang 🛍️',
      () => setIsCartOpen(true)
    );
  };

  return (
    <section id="custom" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-theme-bg border-b border-theme-border">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Interactive Bouquet Builder</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Custom Buket Studio Interaktif
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Rangkai buket impian Anda sendiri secara live. Pilih bunga utama, variasi warna kawat bulu, tema wrapping, serta aksesori wisuda favorit Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* STEP CONTROLS (LEFT COLUMN) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
            
            {/* STEP 1: PILIH BUNGA */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Pilih Jenis Bunga Utama:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FLOWERS.map((f) => {
                  const isSelected = selectedFlower.id === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFlower(f)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/80 shadow-2xs ring-2 ring-rose-400/20'
                          : 'border-stone-200 hover:border-rose-200 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{f.emoji}</div>
                      <div className="text-xs font-bold text-stone-800">{f.name}</div>
                      <div className="text-[10px] text-rose-600 font-extrabold mt-0.5">
                        Rp {f.basePrice.toLocaleString('id-ID')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: WARNA KAWAT BULU */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">2</span>
                <span>Pilih Warna Kawat Bulu (Chenille Stem):</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {COLORS.map((c) => {
                  const isSelected = selectedColor.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`p-2.5 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/80 shadow-2xs ring-2 ring-rose-400/20'
                          : 'border-stone-200 hover:border-rose-200 bg-white'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 flex-shrink-0 shadow-2xs"
                        style={{ backgroundColor: c.colorHex }}
                      />
                      <span className="text-xs font-bold text-stone-800 truncate">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: TEMA WRAPPING */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Tema Kertas Wrapping (Cellophane):</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {WRAPPINGS.map((w) => {
                  const isSelected = selectedWrapping.id === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setSelectedWrapping(w)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/80 shadow-2xs ring-2 ring-rose-400/20'
                          : 'border-stone-200 hover:border-rose-200 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-stone-800">{w.name}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{w.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: AKSESORI UPSELLING */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">4</span>
                <span>Tambahan Aksesori (Upselling Add-ons):</span>
              </label>
              <div className="space-y-2">
                {ADDONS.map((a) => {
                  const isChecked = selectedAddons.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      onClick={() => toggleAddon(a.id)}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-rose-500 bg-rose-50/80 shadow-2xs'
                          : 'border-stone-200 hover:border-rose-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{a.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-stone-800">{a.name}</div>
                          <div className="text-[10px] text-stone-500 font-semibold">
                            +Rp {a.price.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-rose-600 border-rose-600 text-white' : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LIVE PREVIEW & PRICE CARD (RIGHT COLUMN) */}
          <div className="lg:col-span-5 space-y-4 sticky top-20">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-lg space-y-6">
              
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-stone-800 mb-3">
                  Preview Desain Buket
                </h3>
                
                {/* PREVIEW CANVAS */}
                <div
                  className="rounded-2xl p-8 text-center border-2 border-dashed border-rose-200 flex flex-col items-center justify-center min-h-[190px] transition-colors overflow-hidden"
                  style={{ backgroundColor: `${selectedColor.colorHex}25` }}
                >
                  <span className="animate-float-hero text-7xl mb-2 inline-block drop-shadow-md transition-transform duration-300 hover:scale-110">
                    {selectedFlower.emoji}
                  </span>
                  <div className="text-xs font-black text-stone-800 mt-2">
                    {selectedFlower.name} • {selectedColor.name}
                  </div>
                  <div className="text-[10px] text-rose-700 font-semibold">
                    Wrapping: {selectedWrapping.name}
                  </div>
                </div>
              </div>

              {/* ORDER SUMMARY */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Bunga Utama:</span>
                  <strong className="text-stone-800">{selectedFlower.name} ({selectedColor.name})</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Wrapping:</span>
                  <strong className="text-stone-800">{selectedWrapping.name}</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Aksesori Tambahan:</span>
                  <strong className="text-stone-800">
                    {selectedAddons.length > 0 ? `${selectedAddons.length} item dipilih` : 'Tidak Ada'}
                  </strong>
                </div>

                <div className="pt-2 border-t border-dashed border-stone-300 flex justify-between items-center text-sm font-black text-rose-600">
                  <span>Estimasi Total:</span>
                  <span className="text-base font-extrabold text-stone-900">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="btn-shimmer w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Pesanan ke WhatsApp Pengrajin</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleAddToCart(e)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>+ Masukkan ke Keranjang Belanja</span>
                </button>
              </div>

              <div className="text-[11px] text-stone-400 text-center font-medium">
                ⚡ Waktu pengerjaan Pre-Order rata-rata 2-3 hari kerja.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

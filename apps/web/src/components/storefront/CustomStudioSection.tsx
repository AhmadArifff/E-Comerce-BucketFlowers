'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, ShoppingBag, Check, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { getThemeCopy } from '@/lib/theme-copy';
import { flyToCart, showMagicToast } from '@/lib/magic-motion';
import { getApiUrl } from '@/lib/api-client';

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

interface RibbonOpt {
  id: string;
  name: string;
  desc: string;
  price: number;
  emoji: string;
}

interface PackagingOpt {
  id: string;
  name: string;
  desc: string;
  price: number;
  icon: string;
}

interface GreetingOpt {
  id: string;
  name: string;
  desc: string;
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

const RIBBONS: RibbonOpt[] = [
  { id: 'satin', name: 'Pita Satin Mengkilap', desc: 'Klasik elegan berkilau', price: 0, emoji: '🎀' },
  { id: 'organza', name: 'Pita Organza Transparan', desc: 'Kesan dreamy & airy', price: 5000, emoji: '🎗️' },
  { id: 'chiffon', name: 'Chiffon Ruffle Wave', desc: 'Aksen gelombang Korea', price: 7500, emoji: '🌸' },
  { id: 'rustic', name: 'Tali Rami Vintage', desc: 'Nuansa rustic estetik', price: 3000, emoji: '🧵' },
];

const PACKAGINGS: PackagingOpt[] = [
  { id: 'standard', name: 'Standard Protective Sleeve', desc: 'Plastik florist tebal bening', price: 0, icon: '📦' },
  { id: 'mika_box', name: 'Box Jendela Mika Eksklusif', desc: 'Kotak kardus kaku mewah', price: 12000, icon: '🎁' },
  { id: 'pvc_bag', name: 'Tas Jinjing PVC Bening', desc: 'Tas aesthetic praktis wisuda', price: 8000, icon: '🛍️' },
  { id: 'gold_bag', name: 'Paper Bag Mewah Lis Gold', desc: 'Tas kertas tebal premium', price: 6000, icon: '👜' },
];

const GREETINGS: GreetingOpt[] = [
  { id: 'print_standard', name: 'Kartu Standard Cetak', desc: 'Art paper 260gsm cetak rapi', price: 0, icon: '✉️' },
  { id: 'gold_foil', name: 'Kartu Hotprint Gold Foil', desc: 'Tulisan emas berkilau mewah', price: 5000, icon: '✨' },
  { id: 'wax_seal', name: 'Vintage Wax Seal Stamp', desc: 'Amplop segel lilin stempel bunga', price: 8000, icon: '📜' },
];

const ADDONS: AddonOpt[] = [
  { id: 'led', name: 'Lampu LED Fairy Light (Warm Glow)', price: 10000, icon: '💡' },
  { id: 'bear', name: 'Boneka Toga Wisuda Mini (10cm)', price: 15000, icon: '🧸' },
  { id: 'pin', name: 'Pin Bros Kupu-kupu Kristal', price: 5000, icon: '🦋' },
];

export const CustomStudioSection: React.FC = () => {
  const { addItem, setIsCartOpen } = useCartStore();
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Dynamic Options State (initialized with static fallback)
  const [flowers, setFlowers] = useState<FlowerOpt[]>(FLOWERS);
  const [colors, setColors] = useState<ColorOpt[]>(COLORS);
  const [wrappings, setWrappings] = useState<WrappingOpt[]>(WRAPPINGS);
  const [ribbons, setRibbons] = useState<RibbonOpt[]>(RIBBONS);
  const [packagings, setPackagings] = useState<PackagingOpt[]>(PACKAGINGS);
  const [greetings, setGreetings] = useState<GreetingOpt[]>(GREETINGS);
  const [addons, setAddons] = useState<AddonOpt[]>(ADDONS);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? theme : 'tema-a';
  const copy = getThemeCopy(activeTheme);

  const [selectedFlower, setSelectedFlower] = useState<FlowerOpt>(FLOWERS[0]);
  const [selectedColor, setSelectedColor] = useState<ColorOpt>(COLORS[0]);
  const [selectedWrapping, setSelectedWrapping] = useState<WrappingOpt>(WRAPPINGS[0]);
  const [selectedRibbon, setSelectedRibbon] = useState<RibbonOpt>(RIBBONS[0]);
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingOpt>(PACKAGINGS[0]);
  const [selectedGreeting, setSelectedGreeting] = useState<GreetingOpt>(GREETINGS[0]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['led']);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch dynamic custom studio options from database
  useEffect(() => {
    const fetchStudioOptions = async () => {
      try {
        const res = await fetch(getApiUrl('/api/v1/custom-studio'));
        const json = await res.json();
        if (json.success && json.data?.grouped) {
          const g = json.data.grouped;

          if (Array.isArray(g.FLOWER_TYPE) && g.FLOWER_TYPE.length > 0) {
            const mappedFlowers: FlowerOpt[] = g.FLOWER_TYPE.map((f: any) => ({
              id: f.id,
              name: f.name,
              emoji: f.emoji_or_icon || '🌸',
              basePrice: Number(f.price_modifier) || 0,
            }));
            setFlowers(mappedFlowers);
            setSelectedFlower((prev) => mappedFlowers.find((f) => f.id === prev.id) || mappedFlowers[0]);
          }

          if (Array.isArray(g.CHENILLE_COLOR) && g.CHENILLE_COLOR.length > 0) {
            const mappedColors: ColorOpt[] = g.CHENILLE_COLOR.map((c: any) => ({
              id: c.id,
              name: c.name,
              colorHex: c.hex_color || '#F4A7B9',
            }));
            setColors(mappedColors);
            setSelectedColor((prev) => mappedColors.find((c) => c.id === prev.id) || mappedColors[0]);
          }

          if (Array.isArray(g.WRAPPING_STYLE) && g.WRAPPING_STYLE.length > 0) {
            const mappedWrappings: WrappingOpt[] = g.WRAPPING_STYLE.map((w: any) => ({
              id: w.id,
              name: w.name,
              desc: w.description || '',
            }));
            setWrappings(mappedWrappings);
            setSelectedWrapping((prev) => mappedWrappings.find((w) => w.id === prev.id) || mappedWrappings[0]);
          }

          if (Array.isArray(g.RIBBON_STYLE) && g.RIBBON_STYLE.length > 0) {
            const mappedRibbons: RibbonOpt[] = g.RIBBON_STYLE.map((r: any) => ({
              id: r.id,
              name: r.name,
              desc: r.description || '',
              price: Number(r.price_modifier) || 0,
              emoji: r.emoji_or_icon || '🎀',
            }));
            setRibbons(mappedRibbons);
            setSelectedRibbon((prev) => mappedRibbons.find((r) => r.id === prev.id) || mappedRibbons[0]);
          }

          if (Array.isArray(g.PACKAGING_BOX) && g.PACKAGING_BOX.length > 0) {
            const mappedPackagings: PackagingOpt[] = g.PACKAGING_BOX.map((p: any) => ({
              id: p.id,
              name: p.name,
              desc: p.description || '',
              price: Number(p.price_modifier) || 0,
              icon: p.emoji_or_icon || '📦',
            }));
            setPackagings(mappedPackagings);
            setSelectedPackaging((prev) => mappedPackagings.find((p) => p.id === prev.id) || mappedPackagings[0]);
          }

          if (Array.isArray(g.GREETING_SEAL) && g.GREETING_SEAL.length > 0) {
            const mappedGreetings: GreetingOpt[] = g.GREETING_SEAL.map((gr: any) => ({
              id: gr.id,
              name: gr.name,
              desc: gr.description || '',
              price: Number(gr.price_modifier) || 0,
              icon: gr.emoji_or_icon || '✉️',
            }));
            setGreetings(mappedGreetings);
            setSelectedGreeting((prev) => mappedGreetings.find((gr) => gr.id === prev.id) || mappedGreetings[0]);
          }

          if (Array.isArray(g.ACCESSORY_ADDON) && g.ACCESSORY_ADDON.length > 0) {
            const mappedAddons: AddonOpt[] = g.ACCESSORY_ADDON.map((a: any) => ({
              id: a.id,
              name: a.name,
              price: Number(a.price_modifier) || 0,
              icon: a.emoji_or_icon || '✨',
            }));
            setAddons(mappedAddons);
          }
        }
      } catch (e) {
        console.warn('Failed to load live custom studio options, using fallbacks:', e);
      }
    };

    fetchStudioOptions();
  }, []);

  // Telemetry: Log Custom Studio 4-Step funnel event
  const logStudioStep = (stepNumber: number) => {
    if (typeof window === 'undefined') return;
    try {
      let sessId = sessionStorage.getItem('chenille_studio_session_id');
      if (!sessId) {
        sessId = `studio-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        sessionStorage.setItem('chenille_studio_session_id', sessId);
      }

      fetch(getApiUrl('/api/v1/telemetry/event'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessId,
          event_name: 'STUDIO_STEP_VIEWED',
          step_number: stepNumber,
          metadata: {
            step: stepNumber,
            flower: selectedFlower?.id,
            color: selectedColor?.id,
          },
        }),
      }).catch(() => {});
    } catch {
      // ignore telemetry network errors
    }
  };

  useEffect(() => {
    logStudioStep(1);
  }, []);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const found = addons.find((a) => a.id === addonId);
    return sum + (found ? found.price : 0);
  }, 0);

  const totalPrice =
    selectedFlower.basePrice +
    selectedRibbon.price +
    selectedPackaging.price +
    selectedGreeting.price +
    addonsTotal;

  const handleWhatsAppOrder = () => {
    const activeAddonNames = selectedAddons
      .map((id) => addons.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const message = `Halo Atelier Chenille Flowers! 🌸
Saya ingin memesan Custom Buket Kawat Bulu dengan detail:
- Bunga Utama: ${selectedFlower.name} (${selectedFlower.emoji})
- Warna Kawat Bulu: ${selectedColor.name}
- Kertas Wrapping: ${selectedWrapping.name}
- Pilihan Pita: ${selectedRibbon.name} (${selectedRibbon.emoji})
- Packaging Box: ${selectedPackaging.name}
- Kartu & Segel: ${selectedGreeting.name}
- Aksesori Tambahan: ${activeAddonNames || 'Tanpa Aksesori Tambahan'}
- Estimasi Total: Rp ${totalPrice.toLocaleString('id-ID')}

Apakah slot antrean perangkaian masih tersedia untuk pengiriman segera? Terima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/6281298317721?text=${encoded}`, '_blank');
  };

  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (isAdding) return;
    setIsAdding(true);
    logStudioStep(4);
    if (e) {
      flyToCart(e.currentTarget, selectedFlower.emoji, () => {
        setIsAdding(false);
        setIsCartOpen(true);
      });
    } else {
      setIsAdding(false);
      setIsCartOpen(true);
    }
    const activeAddonNames = selectedAddons
      .map((id) => addons.find((a) => a.id === id)?.name)
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
      description: `Buket custom ${selectedFlower.name} (${selectedColor.name}), wrapping ${selectedWrapping.name}, pita ${selectedRibbon.name}, box ${selectedPackaging.name}, kartu ${selectedGreeting.name}${activeAddonNames ? ' dan aksesori: ' + activeAddonNames : ''}.`,
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-surface-subtle border border-theme-border text-theme-primary text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-theme-primary" />
            <span>Interactive Bouquet Builder</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-theme-text-main tracking-tight font-heading">
            {copy.customStudio.title}
          </h2>
          <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
            {copy.customStudio.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* STEP CONTROLS (LEFT COLUMN) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-theme-border shadow-sm space-y-7">
            
            {/* STEP 1: PILIH BUNGA */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-theme-text-main flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-theme-primary text-white flex items-center justify-center text-[10px]">1</span>
                <span>{copy.customStudio.step1Label}:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {flowers.map((f) => {
                  const isSelected = selectedFlower.id === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setSelectedFlower(f);
                        logStudioStep(1);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-2xs ring-2 ring-theme-primary/20'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{f.emoji}</div>
                      <div className="text-xs font-bold text-theme-text-main">{f.name}</div>
                      <div className="text-[10px] text-theme-primary font-extrabold mt-0.5">
                        Rp {f.basePrice.toLocaleString('id-ID')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: WARNA KAWAT BULU */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-theme-text-main flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-theme-primary text-white flex items-center justify-center text-[10px]">2</span>
                <span>{copy.customStudio.step2Label}:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {colors.map((c) => {
                  const isSelected = selectedColor.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c);
                        logStudioStep(2);
                      }}
                      className={`p-2.5 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-2xs ring-2 ring-theme-primary/20'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 flex-shrink-0 shadow-2xs"
                        style={{ backgroundColor: c.colorHex }}
                      />
                      <span className="text-xs font-bold text-theme-text-main truncate">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: TEMA WRAPPING */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-theme-text-main flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-theme-primary text-white flex items-center justify-center text-[10px]">3</span>
                <span>{copy.customStudio.step3Label}:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {wrappings.map((w) => {
                  const isSelected = selectedWrapping.id === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => {
                        setSelectedWrapping(w);
                        logStudioStep(3);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-2xs ring-2 ring-theme-primary/20'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-theme-text-main">{w.name}</div>
                      <div className="text-[10px] text-theme-text-muted mt-0.5">{w.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: PILIHAN PITA & RIBBON */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-theme-text-main flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-theme-primary text-white flex items-center justify-center text-[10px]">4</span>
                <span>{copy.customStudio.step4Label}:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ribbons.map((r) => {
                  const isSelected = selectedRibbon.id === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setSelectedRibbon(r);
                        logStudioStep(3);
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-2xs ring-2 ring-theme-primary/20'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="text-lg mb-0.5">{r.emoji}</div>
                      <div className="text-[11px] font-bold text-theme-text-main leading-tight line-clamp-1">{r.name}</div>
                      <div className="text-[10px] text-theme-primary font-black mt-0.5">
                        {r.price === 0 ? 'Gratis' : `+Rp ${r.price.toLocaleString('id-ID')}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 5: PACKAGING & DELIVERY BOX */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-theme-text-main flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-theme-primary text-white flex items-center justify-center text-[10px]">5</span>
                <span>Packaging Eksklusif & Delivery:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {packagings.map((p) => {
                  const isSelected = selectedPackaging.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPackaging(p)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-2xs ring-2 ring-theme-primary/20'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="text-lg mb-0.5">{p.icon}</div>
                      <div className="text-[11px] font-bold text-theme-text-main leading-tight line-clamp-1">{p.name}</div>
                      <div className="text-[10px] text-theme-primary font-black mt-0.5">
                        {p.price === 0 ? 'Standar' : `+Rp ${p.price.toLocaleString('id-ID')}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 6: KARTU UCAPAN & SEAL */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-theme-text-main flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-theme-primary text-white flex items-center justify-center text-[10px]">6</span>
                <span>Kartu Ucapan & Finishing Seal:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {greetings.map((g) => {
                  const isSelected = selectedGreeting.id === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGreeting(g)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-2xs ring-2 ring-theme-primary/20'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{g.icon}</span>
                        <span className="text-xs font-bold text-theme-text-main truncate">{g.name}</span>
                      </div>
                      <div className="text-[10px] text-theme-text-muted">{g.desc}</div>
                      <div className="text-[10px] text-theme-primary font-extrabold mt-1">
                        {g.price === 0 ? 'Gratis' : `+Rp ${g.price.toLocaleString('id-ID')}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 7: AKSESORI UPSELLING */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-theme-text-main flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-theme-primary text-white flex items-center justify-center text-[10px]">7</span>
                <span>Tambahan Aksesori (Upselling Add-ons):</span>
              </label>
              <div className="space-y-2">
                {addons.map((a) => {
                  const isChecked = selectedAddons.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      onClick={() => toggleAddon(a.id)}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-2xs'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{a.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-theme-text-main">{a.name}</div>
                          <div className="text-[10px] text-theme-text-muted font-semibold">
                            +Rp {a.price.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-theme-primary border-theme-primary text-white' : 'border-stone-300 bg-white'
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
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-theme-border shadow-lg space-y-6">
              
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-theme-text-main mb-3">
                  Preview Desain Buket
                </h3>
                
                {/* PREVIEW CANVAS */}
                <div
                  className="rounded-2xl p-6 text-center border-2 border-dashed border-theme-border flex flex-col items-center justify-center min-h-[220px] transition-colors overflow-hidden"
                  style={{ backgroundColor: `${selectedColor.colorHex}25` }}
                >
                  <span className="animate-float-hero text-7xl mb-2 inline-block drop-shadow-md transition-transform duration-300 hover:scale-110">
                    {selectedFlower.emoji}
                  </span>
                  <div className="text-xs font-black text-theme-text-main mt-2">
                    {selectedFlower.name} • {selectedColor.name}
                  </div>
                  <div className="text-[10px] text-theme-primary font-semibold">
                    Wrapping: {selectedWrapping.name}
                  </div>
                  
                  {/* DETAIL BADGES */}
                  <div className="flex flex-wrap items-center gap-1.5 justify-center mt-3 max-w-xs">
                    <span className="px-2 py-0.5 rounded-full bg-white/90 border border-stone-200 text-[10px] font-bold text-stone-700 flex items-center gap-1 shadow-2xs">
                      <span>{selectedRibbon.emoji}</span> {selectedRibbon.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/90 border border-stone-200 text-[10px] font-bold text-stone-700 flex items-center gap-1 shadow-2xs">
                      <span>{selectedPackaging.icon}</span> {selectedPackaging.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/90 border border-stone-200 text-[10px] font-bold text-stone-700 flex items-center gap-1 shadow-2xs">
                      <span>{selectedGreeting.icon}</span> {selectedGreeting.name}
                    </span>
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
                  <span>Pita Ribbon:</span>
                  <strong className="text-stone-800">{selectedRibbon.name} ({selectedRibbon.price === 0 ? 'Gratis' : `+Rp ${selectedRibbon.price.toLocaleString('id-ID')}`})</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Packaging Box:</span>
                  <strong className="text-stone-800">{selectedPackaging.name} ({selectedPackaging.price === 0 ? 'Standar' : `+Rp ${selectedPackaging.price.toLocaleString('id-ID')}`})</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Kartu & Seal:</span>
                  <strong className="text-stone-800">{selectedGreeting.name} ({selectedGreeting.price === 0 ? 'Gratis' : `+Rp ${selectedGreeting.price.toLocaleString('id-ID')}`})</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Aksesori Tambahan:</span>
                  <strong className="text-stone-800">
                    {selectedAddons.length > 0 ? `${selectedAddons.length} item dipilih (+Rp ${addonsTotal.toLocaleString('id-ID')})` : 'Tidak Ada'}
                  </strong>
                </div>

                <div className="pt-2 border-t border-dashed border-stone-300 flex justify-between items-center text-sm font-black text-theme-primary">
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
                  disabled={isAdding}
                  onClick={(e) => handleAddToCart(e)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-theme-surface-subtle hover:bg-white text-theme-primary border border-theme-border font-extrabold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdding ? 'Buket Custom Ditambahkan...' : copy.customStudio.checkoutBtn}</span>
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

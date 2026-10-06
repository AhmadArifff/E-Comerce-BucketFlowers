'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, ShoppingBag, Check, CheckCircle2, Clock, Package, Mail, Gift } from 'lucide-react';
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
  imageUrl?: string;
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
  { id: 'tulip', name: 'Tulip Pastel Korea', emoji: '🌷', basePrice: 120000, imageUrl: '/images/studio/flower-tulip-pastel.jpg' },
  { id: 'rose', name: 'Mawar Velvet Merah', emoji: '🌹', basePrice: 130000, imageUrl: '/images/studio/flower-rose-velvet.jpg' },
  { id: 'sunflower', name: 'Bunga Matahari Wisuda', emoji: '🌻', basePrice: 115000, imageUrl: '/images/studio/flower-sunflower-bear.jpg' },
  { id: 'lavender', name: 'Lavender Lilac Serene', emoji: '🪻', basePrice: 125000, imageUrl: '/images/studio/flower-lavender-lilac.jpg' },
  { id: 'karakter', name: 'Karakter Wisuda Toga', emoji: '🧸', basePrice: 140000, imageUrl: '/images/studio/flower-karakter-wisuda.jpg' },
  { id: 'minipot', name: 'Mini Pot Daisy Meja', emoji: '🪴', basePrice: 65000, imageUrl: '/images/studio/flower-mini-pot.jpg' },
  { id: 'midnight', name: 'Midnight Rose Deluxe', emoji: '🥀', basePrice: 165000, imageUrl: '/images/studio/flower-midnight-romance.jpg' },
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
            const mappedFlowers: FlowerOpt[] = g.FLOWER_TYPE.map((f: any) => {
              const s = `${f.id} ${f.name}`.toLowerCase();
              let img = '/images/studio/flower-tulip-pastel.jpg';
              if (s.includes('rose') || s.includes('mawar') || s.includes('midnight')) img = '/images/studio/flower-rose-velvet.jpg';
              else if (s.includes('sun') || s.includes('matahari')) img = '/images/studio/flower-sunflower-bear.jpg';
              else if (s.includes('lavender')) img = '/images/studio/flower-lavender-lilac.jpg';
              else if (s.includes('karakter') || s.includes('bear') || s.includes('toga')) img = '/images/studio/flower-karakter-wisuda.jpg';
              else if (s.includes('pot') || s.includes('daisy')) img = '/images/studio/flower-mini-pot.jpg';

              return {
                id: f.id,
                name: f.name,
                emoji: f.emoji_or_icon || '🌸',
                basePrice: Number(f.price_modifier) || 0,
                imageUrl: img,
              };
            });
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
      image: selectedFlower.imageUrl || '/preview-tema-a.jpg',
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer group flex flex-col justify-between ${
                        isSelected
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-xs ring-2 ring-theme-primary/30'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-stone-100 shadow-2xs">
                        {f.imageUrl ? (
                          <img
                            src={f.imageUrl}
                            alt={f.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-3xl flex items-center justify-center w-full h-full">{f.emoji}</div>
                        )}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-theme-primary text-white flex items-center justify-center text-xs shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="text-[11px] font-black text-theme-text-main line-clamp-1">{f.name}</div>
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
                  const gradient =
                    w.id === 'korean_pink'
                      ? 'from-pink-300 via-rose-200 to-pink-400'
                      : w.id === 'lilac_white'
                      ? 'from-purple-300 via-white to-purple-400'
                      : 'from-amber-200 via-stone-200 to-amber-300';
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => {
                        setSelectedWrapping(w);
                        logStudioStep(3);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                        isSelected
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-xs ring-2 ring-theme-primary/20'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className={`h-2.5 w-full rounded-full bg-gradient-to-r ${gradient} mb-2 shadow-inner border border-black/5`} />
                      <div className="text-xs font-bold text-theme-text-main flex items-center justify-between">
                        <span>{w.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-theme-primary" />}
                      </div>
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
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer group ${
                        isSelected
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-xs ring-2 ring-theme-primary/20'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{r.emoji}</span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-theme-primary text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-bold text-theme-text-main leading-tight line-clamp-1">{r.name}</div>
                      <div className="text-[10px] text-theme-primary font-black mt-1">
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
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer group ${
                        isSelected
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-xs ring-2 ring-theme-primary/20'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{p.icon}</span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-theme-primary text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-bold text-theme-text-main leading-tight line-clamp-1">{p.name}</div>
                      <div className="text-[10px] text-theme-primary font-black mt-1">
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
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer group ${
                        isSelected
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-xs ring-2 ring-theme-primary/20'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{g.icon}</span>
                          <span className="text-xs font-bold text-theme-text-main truncate">{g.name}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-theme-primary shrink-0" />}
                      </div>
                      <div className="text-[10px] text-theme-text-muted">{g.desc}</div>
                      <div className="text-[10px] text-theme-primary font-extrabold mt-1.5">
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
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-xs ring-1 ring-theme-primary/30'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{a.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-theme-text-main flex items-center gap-1.5">
                            <span>{a.name}</span>
                            {isChecked && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-theme-primary text-white">
                                Terpasang
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-theme-text-muted font-semibold mt-0.5">
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
                
                {/* PREVIEW CANVAS DENGAN SISTEM LAYERED MODULAR CANVAS */}
                <div
                  className={`rounded-3xl border-2 transition-all duration-500 overflow-hidden shadow-inner flex flex-col group relative ${
                    selectedPackaging.id === 'mika_box'
                      ? 'border-amber-300 bg-gradient-to-b from-amber-50/40 via-stone-50 to-amber-100/30 ring-4 ring-amber-300/20'
                      : selectedPackaging.id === 'pvc_bag'
                      ? 'border-sky-300 bg-gradient-to-b from-sky-50/30 via-stone-50 to-slate-100/50 ring-4 ring-sky-200/20'
                      : selectedPackaging.id === 'gold_bag'
                      ? 'border-stone-400 bg-gradient-to-b from-stone-100 via-white to-stone-200/50 ring-4 ring-amber-300/20'
                      : 'border-theme-border bg-gradient-to-b from-stone-50 via-white to-stone-100/60'
                  }`}
                >
                  {/* TOP PACKAGING HEADER (JIKA MEMILIH KEMASAN KHUSUS) */}
                  {selectedPackaging.id === 'mika_box' && (
                    <div className="bg-gradient-to-r from-amber-500/15 via-amber-400/25 to-amber-500/15 border-b border-amber-300/50 px-3 py-1 text-center flex items-center justify-center gap-1.5 z-20">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest">
                        Box Jendela Mika Eksklusif
                      </span>
                      <Sparkles className="w-3 h-3 text-amber-600" />
                    </div>
                  )}

                  {selectedPackaging.id === 'pvc_bag' && (
                    <div className="bg-gradient-to-r from-sky-500/10 via-sky-400/20 to-sky-500/10 border-b border-sky-300/40 px-3 py-1 text-center flex items-center justify-center gap-1.5 z-20">
                      <ShoppingBag className="w-3 h-3 text-sky-600" />
                      <span className="text-[10px] font-black text-sky-900 uppercase tracking-widest">
                        Tas Jinjing PVC Florist Bening
                      </span>
                    </div>
                  )}

                  {selectedPackaging.id === 'gold_bag' && (
                    <div className="bg-gradient-to-r from-stone-900/10 via-amber-600/15 to-stone-900/10 border-b border-amber-400/40 px-3 py-1 text-center flex items-center justify-center gap-1.5 z-20">
                      <Package className="w-3 h-3 text-amber-700" />
                      <span className="text-[10px] font-black text-stone-900 uppercase tracking-widest">
                        Paper Bag Mewah Lis Gold
                      </span>
                    </div>
                  )}

                  {/* THE INTERACTIVE MULTI-LAYER CANVAS STAGE */}
                  <div className="relative w-full h-80 sm:h-96 flex items-center justify-center p-3 overflow-hidden select-none">
                    {/* LAYER 0: VELVET COLOR AMBIENT HALO */}
                    <div
                      className="absolute inset-0 transition-all duration-700 pointer-events-none opacity-40 blur-2xl"
                      style={{
                        background: `radial-gradient(circle at 50% 45%, ${selectedColor.colorHex} 0%, rgba(255,255,255,0) 70%)`,
                      }}
                    />

                    {/* LAYER 1: CELLOPHANE WRAPPING WINGS & BACKDROP */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500">
                      {selectedWrapping.id === 'korean_pink' && (
                        <>
                          <div className="w-56 sm:w-64 h-64 sm:h-76 rounded-[40px] rotate-3 bg-gradient-to-tr from-pink-300/40 via-rose-100/30 to-pink-400/40 border border-pink-300/50 shadow-inner scale-105 transition-all duration-500" />
                          <div className="w-56 sm:w-64 h-64 sm:h-76 rounded-[40px] -rotate-3 bg-gradient-to-tl from-rose-200/30 via-pink-50/20 to-rose-300/30 border border-rose-300/40 shadow-inner scale-105 transition-all duration-500" />
                        </>
                      )}
                      {selectedWrapping.id === 'lilac_white' && (
                        <>
                          <div className="w-56 sm:w-64 h-64 sm:h-76 rounded-[40px] rotate-3 bg-gradient-to-tr from-purple-300/40 via-indigo-50/30 to-purple-400/40 border border-purple-300/50 shadow-inner scale-105 transition-all duration-500" />
                          <div className="w-56 sm:w-64 h-64 sm:h-76 rounded-[40px] -rotate-3 bg-gradient-to-tl from-indigo-200/30 via-white/40 to-purple-300/30 border border-purple-200/40 shadow-inner scale-105 transition-all duration-500" />
                        </>
                      )}
                      {selectedWrapping.id === 'clean_oat' && (
                        <>
                          <div className="w-56 sm:w-64 h-64 sm:h-76 rounded-[40px] rotate-3 bg-gradient-to-tr from-amber-200/40 via-stone-100/30 to-orange-200/40 border border-amber-300/50 shadow-inner scale-105 transition-all duration-500" />
                          <div className="w-56 sm:w-64 h-64 sm:h-76 rounded-[40px] -rotate-3 bg-gradient-to-tl from-stone-200/30 via-orange-50/20 to-amber-300/30 border border-amber-200/40 shadow-inner scale-105 transition-all duration-500" />
                        </>
                      )}
                    </div>

                    {/* LAYER 2: CORE BOUQUET PHOTO DENGAN TINT RONA BELUDRU */}
                    <div className="relative w-full h-full flex items-center justify-center z-10 transition-all duration-500">
                      {selectedFlower.imageUrl ? (
                        <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                          <img
                            src={selectedFlower.imageUrl}
                            alt={`Preview Desain ${selectedFlower.name}`}
                            className="w-full h-full object-contain filter drop-shadow-2xl transition-all duration-500"
                          />
                          {/* Subtle color tone overlay to reflect selected velvet wire color */}
                          <div
                            className="absolute inset-0 mix-blend-color opacity-25 pointer-events-none rounded-2xl transition-colors duration-500"
                            style={{ backgroundColor: selectedColor.colorHex }}
                          />
                        </div>
                      ) : (
                        <span className="animate-float-hero text-7xl inline-block drop-shadow-md">
                          {selectedFlower.emoji}
                        </span>
                      )}
                    </div>

                    {/* LAYER 3: ATELIER RIBBON KNOT & STREAMERS DI PINGGANG BUKET */}
                    <div className="absolute bottom-12 sm:bottom-14 inset-x-0 flex flex-col items-center justify-center z-20 pointer-events-none transition-all duration-500">
                      <div
                        className={`px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-md border transition-all duration-300 ${
                          selectedRibbon.id === 'satin'
                            ? 'bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500 text-white border-pink-300 shadow-pink-500/25 ring-2 ring-pink-200'
                            : selectedRibbon.id === 'organza'
                            ? 'bg-white/90 backdrop-blur-md text-pink-700 border-pink-300 shadow-pink-300/30 ring-2 ring-pink-100'
                            : selectedRibbon.id === 'chiffon'
                            ? 'bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400 text-white border-purple-200 shadow-purple-500/25'
                            : 'bg-amber-800 text-amber-100 border-amber-900/60 shadow-amber-900/30'
                        }`}
                      >
                        <span>{selectedRibbon.emoji}</span>
                        <span>{selectedRibbon.name}</span>
                      </div>
                      {/* Cascading Ribbon Tails */}
                      <div className="flex items-center gap-3.5 -mt-0.5 opacity-90">
                        <div
                          className={`w-1.5 h-6 rounded-b-full -rotate-12 transition-all duration-300 ${
                            selectedRibbon.id === 'satin'
                              ? 'bg-pink-500'
                              : selectedRibbon.id === 'organza'
                              ? 'bg-pink-300/80 border border-pink-400/50'
                              : selectedRibbon.id === 'chiffon'
                              ? 'bg-purple-400'
                              : 'bg-amber-800'
                          }`}
                        />
                        <div
                          className={`w-1.5 h-7 rounded-b-full rotate-12 transition-all duration-300 ${
                            selectedRibbon.id === 'satin'
                              ? 'bg-rose-500'
                              : selectedRibbon.id === 'organza'
                              ? 'bg-pink-300/80 border border-pink-400/50'
                              : selectedRibbon.id === 'chiffon'
                              ? 'bg-pink-400'
                              : 'bg-amber-800'
                          }`}
                        />
                      </div>
                    </div>

                    {/* LAYER 4: UPSELLING ACCESSORIES OVERLAYS */}
                    {/* A. LED FAIRY LIGHT (WARM GLOW PARTICLES) */}
                    {selectedAddons.includes('led') && (
                      <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden transition-opacity duration-500">
                        <div className="absolute inset-0 bg-radial from-amber-400/15 via-yellow-200/5 to-transparent animate-pulse pointer-events-none" />
                        <div className="absolute top-1/4 left-1/3 w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_12px_#fbbf24] animate-ping" />
                        <div className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-yellow-200 shadow-[0_0_10px_#fef08a] animate-pulse" />
                        <div
                          className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_10px_#fde68a] animate-ping"
                          style={{ animationDelay: '0.4s' }}
                        />
                        <div
                          className="absolute top-2/5 right-1/4 w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-[0_0_12px_#facc15] animate-pulse"
                          style={{ animationDelay: '0.7s' }}
                        />
                        <div
                          className="absolute top-1/2 right-2/5 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b] animate-ping"
                          style={{ animationDelay: '1s' }}
                        />
                        <div
                          className="absolute top-1/3 left-1/2 w-2 h-2 rounded-full bg-yellow-100 shadow-[0_0_10px_#fef9c3] animate-pulse"
                          style={{ animationDelay: '0.2s' }}
                        />
                        <div className="absolute top-10 left-3 px-2 py-0.5 rounded-full bg-amber-500/90 backdrop-blur-xs text-white text-[9px] font-black flex items-center gap-1 shadow-sm animate-pulse z-20">
                          <span>💡 LED Fairy Lights ON</span>
                        </div>
                      </div>
                    )}

                    {/* B. BONEKA TOGA WISUDA MINI */}
                    {selectedAddons.includes('bear') && (
                      <div className="absolute top-7 right-4 z-25 transition-all duration-300 pointer-events-none">
                        <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-2xl border-2 border-stone-800/20 shadow-lg flex items-center gap-1.5 ring-2 ring-amber-400/40">
                          <span className="text-xl">🧸</span>
                          <div className="text-left">
                            <div className="text-[10px] font-black text-stone-900 leading-tight">Boneka Toga</div>
                            <div className="text-[8px] font-bold text-amber-700 leading-none">Mini 10cm</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* C. PIN BROS KUPU-KUPU KRISTAL */}
                    {selectedAddons.includes('pin') && (
                      <div className="absolute top-20 left-4 z-25 transition-all duration-300 pointer-events-none">
                        <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-2xl border border-sky-300 shadow-md flex items-center gap-1">
                          <span className="text-base">🦋</span>
                          <span className="text-[9px] font-black text-sky-800">Pin Kristal</span>
                        </div>
                      </div>
                    )}

                    {/* LAYER 5: INTERACTIVE GREETING CARD / WAX SEAL TAG (SUDUT BAWAH) */}
                    <div className="absolute bottom-2.5 right-2.5 z-25 transition-all duration-300 pointer-events-none">
                      {selectedGreeting.id === 'wax_seal' && (
                        <div className="bg-amber-50/95 backdrop-blur-md border border-amber-300/80 rounded-xl p-1.5 px-2 shadow-lg flex items-center gap-1.5 max-w-[170px] ring-1 ring-amber-400/30">
                          <div className="w-5 h-5 rounded-full bg-rose-700 text-white flex items-center justify-center text-[10px] shadow-xs shrink-0 font-bold border border-rose-900">
                            ★
                          </div>
                          <div className="text-left min-w-0">
                            <div className="text-[9px] font-black text-amber-950 truncate">Vintage Wax Seal</div>
                            <div className="text-[8px] text-amber-700 font-semibold truncate">Segel Lilin Merah</div>
                          </div>
                        </div>
                      )}
                      {selectedGreeting.id === 'gold_foil' && (
                        <div className="bg-stone-900/90 backdrop-blur-md border-2 border-amber-400 rounded-xl p-1.5 px-2 shadow-lg flex items-center gap-1.5 max-w-[170px] ring-1 ring-amber-300/50">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                          <div className="text-left min-w-0">
                            <div className="text-[9px] font-black text-amber-300 truncate">Hotprint Gold Foil</div>
                            <div className="text-[8px] text-stone-300 font-medium truncate">Aksen Emas Mewah</div>
                          </div>
                        </div>
                      )}
                      {selectedGreeting.id === 'print_standard' && (
                        <div className="bg-white/95 backdrop-blur-md border border-stone-200 rounded-xl p-1 px-2 shadow-sm flex items-center gap-1.5 max-w-[150px]">
                          <Mail className="w-3 h-3 text-theme-primary shrink-0" />
                          <span className="text-[9px] font-bold text-stone-700 truncate">Kartu Standar Cetak</span>
                        </div>
                      )}
                    </div>

                    {/* TOP BADGES */}
                    <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 text-stone-800 text-[10px] font-black tracking-wide flex items-center gap-1.5 shadow-xs">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>100% Kawat Bulu Beludru</span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 text-stone-700 text-[10px] font-bold flex items-center gap-1.5 shadow-xs">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: selectedColor.colorHex }}
                      />
                      <span>{selectedColor.name}</span>
                    </div>
                  </div>

                  {/* INFO BAR BAWAH CANVAS */}
                  <div className="p-3.5 bg-white border-t border-theme-border text-center space-y-1.5">
                    <div className="text-xs font-black text-theme-text-main">
                      {selectedFlower.name} • {selectedColor.name}
                    </div>
                    <div className="text-[10px] text-theme-primary font-semibold">
                      Wrapping: {selectedWrapping.name}
                    </div>

                    {/* DETAIL BADGES */}
                    <div className="flex flex-wrap items-center gap-1.5 justify-center pt-1 max-w-xs mx-auto">
                      <span className="px-2 py-0.5 rounded-full bg-stone-50 border border-stone-200 text-[10px] font-bold text-stone-700 flex items-center gap-1 shadow-2xs">
                        <span>{selectedRibbon.emoji}</span> {selectedRibbon.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-stone-50 border border-stone-200 text-[10px] font-bold text-stone-700 flex items-center gap-1 shadow-2xs">
                        <span>{selectedPackaging.icon}</span> {selectedPackaging.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-stone-50 border border-stone-200 text-[10px] font-bold text-stone-700 flex items-center gap-1 shadow-2xs">
                        <span>{selectedGreeting.icon}</span> {selectedGreeting.name}
                      </span>
                    </div>
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

              <div className="text-[11px] text-stone-500 text-center font-medium flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Estimasi pengerjaan Pre-Order rata-rata 2-3 hari kerja pengrajin.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

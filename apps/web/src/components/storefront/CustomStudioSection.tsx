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
  imageUrl?: string;
}

interface AddonOpt {
  id: string;
  name: string;
  price: number;
  icon: string;
  imageUrl?: string;
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
  imageUrl?: string;
}

interface GreetingOpt {
  id: string;
  name: string;
  desc: string;
  price: number;
  icon: string;
  imageUrl?: string;
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
  { id: 'korean_pink', name: 'Korean Two-Tone Pink', desc: 'Cellophane matte lembut', imageUrl: '/images/studio/wrapping/wrapping-korean-pink.jpg' },
  { id: 'lilac_white', name: 'Lilac & White Velvet', desc: 'Aksen beludru elegan', imageUrl: '/images/studio/wrapping/wrapping-lilac-velvet.jpg' },
  { id: 'clean_oat', name: 'Minimalist Clean Oat', desc: 'Nuansa earth tone aesthetic', imageUrl: '/images/studio/wrapping/wrapping-clean-oat.jpg' },
];

const RIBBONS: RibbonOpt[] = [
  { id: 'satin', name: 'Pita Satin Mengkilap', desc: 'Klasik elegan berkilau', price: 0, emoji: '🎀' },
  { id: 'organza', name: 'Pita Organza Transparan', desc: 'Kesan dreamy & airy', price: 5000, emoji: '🎗️' },
  { id: 'chiffon', name: 'Chiffon Ruffle Wave', desc: 'Aksen gelombang Korea', price: 7500, emoji: '🌸' },
  { id: 'rustic', name: 'Tali Rami Vintage', desc: 'Nuansa rustic estetik', price: 3000, emoji: '🧵' },
];

const PACKAGINGS: PackagingOpt[] = [
  { id: 'standard', name: 'Standard Protective Sleeve', desc: 'Plastik florist tebal bening', price: 0, icon: '📦', imageUrl: '/images/studio/packaging/package-standard.jpg' },
  { id: 'mika_box', name: 'Box Jendela Mika Eksklusif', desc: 'Kotak kardus kaku mewah lis gold', price: 12000, icon: '🎁', imageUrl: '/images/studio/packaging/package-mika-box.jpg' },
  { id: 'pvc_bag', name: 'Tas Jinjing PVC Bening', desc: 'Tas aesthetic praktis wisuda', price: 8000, icon: '🛍️', imageUrl: '/images/studio/packaging/package-pvc-bag.jpg' },
  { id: 'gold_bag', name: 'Paper Bag Mewah Lis Gold', desc: 'Tas kertas tebal premium', price: 6000, icon: '👜', imageUrl: '/images/studio/packaging/package-gold-bag.jpg' },
];

const GREETINGS: GreetingOpt[] = [
  { id: 'print_standard', name: 'Kartu Standard Cetak', desc: 'Art paper 260gsm cetak rapi', price: 0, icon: '✉️', imageUrl: '/images/studio/cards/card-standard.jpg' },
  { id: 'gold_foil', name: 'Kartu Hotprint Gold Foil', desc: 'Tulisan emas berkilau mewah', price: 5000, icon: '✨', imageUrl: '/images/studio/cards/card-gold-foil.jpg' },
  { id: 'wax_seal', name: 'Vintage Wax Seal Stamp', desc: 'Amplop segel lilin stempel bunga', price: 8000, icon: '📜', imageUrl: '/images/studio/cards/card-wax-seal.jpg' },
];

const ADDONS: AddonOpt[] = [
  { id: 'led', name: 'Lampu LED Fairy Light (Warm Glow)', price: 10000, icon: '💡', imageUrl: '/images/studio/addons/addon-led-fairy.jpg' },
  { id: 'bear', name: 'Boneka Toga Wisuda Mini (10cm)', price: 15000, icon: '🧸', imageUrl: '/images/studio/addons/addon-bear-toga.jpg' },
  { id: 'pin', name: 'Pin Bros Kupu-kupu Kristal', price: 5000, icon: '🦋', imageUrl: '/images/studio/addons/addon-butterfly-pin.jpg' },
];

// Helper to resolve combination image for 4 core bouquet choices
const getBouquetPreviewUrl = (
  flowerId: string,
  colorId: string,
  wrappingId: string,
  ribbonId: string
): string => {
  let f = flowerId.replace('c-flw-', '').toLowerCase();
  if (f.includes('tulip')) f = 'tulip';
  else if (f.includes('rose') || f.includes('mawar')) f = 'rose';
  else if (f.includes('sun') || f.includes('matahari')) f = 'sun';
  else if (f.includes('lavender')) f = 'lavender';
  else if (f.includes('karakter') || f.includes('toga') || f.includes('bear')) f = 'karakter';
  else if (f.includes('pot') || f.includes('daisy')) f = 'minipot';
  else if (f.includes('midnight')) f = 'midnight';

  let c = colorId.replace('c-col-', '').toLowerCase();
  if (c.includes('pink')) c = 'pink';
  else if (c.includes('lilac') || c.includes('purple')) c = 'lilac';
  else if (c.includes('blue') || c.includes('sky')) c = 'blue';
  else if (c.includes('sage') || c.includes('green') || c.includes('matcha')) c = 'sage';

  let w = wrappingId.replace('c-wrp-', '').toLowerCase();
  if (w.includes('korean') || w.includes('pink')) w = 'korean';
  else if (w.includes('velvet') || w.includes('lilac') || w.includes('white')) w = 'velvet';
  else if (w.includes('oat') || w.includes('clean')) w = 'oat';

  let r = ribbonId.replace('c-rbn-', '').toLowerCase();
  if (r.includes('satin')) r = 'satin';
  else if (r.includes('organza')) r = 'organza';
  else if (r.includes('chiffon')) r = 'chiffon';
  else if (r.includes('rustic') || r.includes('rami')) r = 'rustic';

  return `/images/studio/combinations/${f}-${c}-${w}-${r}.jpg`;
};

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
  const [bouquetImageSrc, setBouquetImageSrc] = useState<string>('/images/studio/combinations/tulip-pink-korean-satin.jpg');

  // Sync bouquet combination photo whenever user selects any of the 4 core steps
  useEffect(() => {
    const nextSrc = getBouquetPreviewUrl(
      selectedFlower.id,
      selectedColor.id,
      selectedWrapping.id,
      selectedRibbon.id
    );
    setBouquetImageSrc(nextSrc);
  }, [selectedFlower, selectedColor, selectedWrapping, selectedRibbon]);

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
            const mappedWrappings: WrappingOpt[] = g.WRAPPING_STYLE.map((w: any) => {
              const s = `${w.id} ${w.name}`.toLowerCase();
              let img = '/images/studio/wrapping/wrapping-korean-pink.jpg';
              if (s.includes('velvet') || s.includes('lilac') || s.includes('white')) img = '/images/studio/wrapping/wrapping-lilac-velvet.jpg';
              else if (s.includes('oat') || s.includes('clean') || s.includes('earth')) img = '/images/studio/wrapping/wrapping-clean-oat.jpg';
              return {
                id: w.id,
                name: w.name,
                desc: w.description || '',
                imageUrl: img,
              };
            });
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
            const mappedPackagings: PackagingOpt[] = g.PACKAGING_BOX.map((p: any) => {
              const s = `${p.id} ${p.name}`.toLowerCase();
              let img = '/images/studio/packaging/package-standard.jpg';
              if (s.includes('mika')) img = '/images/studio/packaging/package-mika-box.jpg';
              else if (s.includes('pvc')) img = '/images/studio/packaging/package-pvc-bag.jpg';
              else if (s.includes('gold') || s.includes('paper')) img = '/images/studio/packaging/package-gold-bag.jpg';

              return {
                id: p.id,
                name: p.name,
                desc: p.description || '',
                price: Number(p.price_modifier) || 0,
                icon: p.emoji_or_icon || '📦',
                imageUrl: img,
              };
            });
            setPackagings(mappedPackagings);
            setSelectedPackaging((prev) => mappedPackagings.find((p) => p.id === prev.id) || mappedPackagings[0]);
          }

          if (Array.isArray(g.GREETING_SEAL) && g.GREETING_SEAL.length > 0) {
            const mappedGreetings: GreetingOpt[] = g.GREETING_SEAL.map((gr: any) => {
              const s = `${gr.id} ${gr.name}`.toLowerCase();
              let img = '/images/studio/cards/card-standard.jpg';
              if (s.includes('wax') || s.includes('segel') || s.includes('lilin')) img = '/images/studio/cards/card-wax-seal.jpg';
              else if (s.includes('gold') || s.includes('foil')) img = '/images/studio/cards/card-gold-foil.jpg';

              return {
                id: gr.id,
                name: gr.name,
                desc: gr.description || '',
                price: Number(gr.price_modifier) || 0,
                icon: gr.emoji_or_icon || '✉️',
                imageUrl: img,
              };
            });
            setGreetings(mappedGreetings);
            setSelectedGreeting((prev) => mappedGreetings.find((gr) => gr.id === prev.id) || mappedGreetings[0]);
          }

          if (Array.isArray(g.ACCESSORY_ADDON) && g.ACCESSORY_ADDON.length > 0) {
            const mappedAddons: AddonOpt[] = g.ACCESSORY_ADDON.map((a: any) => {
              const s = `${a.id} ${a.name}`.toLowerCase();
              let img = '/images/studio/addons/addon-led-fairy.jpg';
              if (s.includes('bear') || s.includes('boneka') || s.includes('toga')) img = '/images/studio/addons/addon-bear-toga.jpg';
              else if (s.includes('pin') || s.includes('kupu') || s.includes('bros')) img = '/images/studio/addons/addon-butterfly-pin.jpg';

              return {
                id: a.id,
                name: a.name,
                price: Number(a.price_modifier) || 0,
                icon: a.emoji_or_icon || '✨',
                imageUrl: img,
              };
            });
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
      image: bouquetImageSrc || selectedFlower.imageUrl || '/preview-tema-a.jpg',
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
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => {
                        setSelectedWrapping(w);
                        logStudioStep(3);
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                        isSelected
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-xs ring-2 ring-theme-primary/20'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden mb-2 bg-stone-100 shadow-2xs border border-stone-200/60">
                        {w.imageUrl ? (
                          <img
                            src={w.imageUrl}
                            alt={w.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-stone-200" />
                        )}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-theme-primary text-white flex items-center justify-center text-[10px] shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-theme-text-main flex items-center justify-between">
                          <span>{w.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-theme-primary sm:hidden" />}
                        </div>
                        <div className="text-[10px] text-theme-text-muted mt-0.5 line-clamp-1">{w.desc}</div>
                      </div>
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
                      className={`p-2 rounded-2xl border text-left transition-all cursor-pointer group flex flex-col justify-between ${
                        isSelected
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-xs ring-2 ring-theme-primary/20'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-stone-100 shadow-2xs">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-2xl flex items-center justify-center w-full h-full">{p.icon}</div>
                        )}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-theme-primary text-white flex items-center justify-center text-[10px] shadow-xs">
                            ✓
                          </div>
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
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer group flex items-center gap-3 ${
                        isSelected
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-xs ring-2 ring-theme-primary/20'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200 shadow-2xs">
                        {g.imageUrl ? (
                          <img
                            src={g.imageUrl}
                            alt={g.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-xl flex items-center justify-center w-full h-full">{g.icon}</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-theme-text-main truncate">{g.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-theme-primary shrink-0" />}
                        </div>
                        <div className="text-[10px] text-theme-text-muted line-clamp-1">{g.desc}</div>
                        <div className="text-[10px] text-theme-primary font-extrabold mt-1">
                          {g.price === 0 ? 'Gratis' : `+Rp ${g.price.toLocaleString('id-ID')}`}
                        </div>
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
                      className={`p-2 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-theme-primary bg-theme-surface-subtle shadow-xs ring-1 ring-theme-primary/30'
                          : 'border-theme-border hover:border-theme-primary/40 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200 shadow-2xs">
                          {a.imageUrl ? (
                            <img
                              src={a.imageUrl}
                              alt={a.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-xl flex items-center justify-center w-full h-full">{a.icon}</div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-theme-text-main flex items-center gap-1.5">
                            <span>{a.name}</span>
                            {isChecked && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-theme-primary text-white">
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
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-theme-text-main">
                    Preview Desain Buket
                  </h3>
                  <span className="text-[10px] font-extrabold text-theme-primary bg-theme-surface-subtle px-2.5 py-0.5 rounded-full border border-theme-border">
                    {selectedFlower.name} • {selectedColor.name}
                  </span>
                </div>
                
                {/* CLEAN CORE BOUQUET PHOTO STAGE */}
                <div className="rounded-3xl border border-stone-200/80 bg-gradient-to-b from-stone-50 via-white to-stone-100/60 overflow-hidden shadow-inner relative group">
                  {/* Velvet wire subtle ambient halo glow */}
                  <div
                    className="absolute inset-0 transition-all duration-700 pointer-events-none opacity-30 blur-2xl"
                    style={{
                      background: `radial-gradient(circle at 50% 45%, ${selectedColor.colorHex} 0%, rgba(255,255,255,0) 70%)`,
                    }}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 text-stone-800 text-[10px] font-black tracking-wide flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>100% Kawat Bulu Beludru</span>
                  </div>

                  <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 text-stone-700 text-[10px] font-bold flex items-center gap-1.5 shadow-xs">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: selectedColor.colorHex }}
                    />
                    <span>{selectedColor.name}</span>
                  </div>

                  {/* HIGH-RES BOUQUET COMBINATION PHOTOGRAPH */}
                  <div className="relative w-full h-80 sm:h-96 flex items-center justify-center p-4 overflow-hidden select-none">
                    <img
                      key={bouquetImageSrc}
                      src={bouquetImageSrc}
                      alt={`Preview Desain ${selectedFlower.name}`}
                      className="w-full h-full object-contain filter drop-shadow-xl transition-all duration-500 group-hover:scale-102"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (selectedFlower.imageUrl && target.src !== selectedFlower.imageUrl) {
                          target.src = selectedFlower.imageUrl;
                        }
                      }}
                    />
                  </div>

                  {/* INFO BAR BAWAH CANVAS */}
                  <div className="p-3 bg-stone-50/90 border-t border-stone-200/80 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-stone-700">
                      <span className="flex items-center gap-1">
                        <span className="text-stone-400 font-semibold">Wrapping:</span> {selectedWrapping.name}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="flex items-center gap-1">
                        <span className="text-stone-400 font-semibold">Pita:</span> {selectedRibbon.emoji} {selectedRibbon.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* KELENGKAPAN PAKET YANG DIPILIH (PACKAGE BUNDLE VISUALIZER) */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-theme-primary" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-theme-text-main">
                      Kelengkapan Paket yang Dipilih
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-stone-500">
                    Poin 5 – 7
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* 1. Kemasan Box/Bag */}
                  <div className="p-2 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-white border border-stone-200 shadow-2xs">
                      {selectedPackaging.imageUrl ? (
                        <img
                          src={selectedPackaging.imageUrl}
                          alt={selectedPackaging.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-base flex items-center justify-center w-full h-full">{selectedPackaging.icon}</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[8px] font-semibold text-stone-500 uppercase tracking-wider">Kemasan Delivery</div>
                      <div className="text-xs font-bold text-stone-800 truncate">{selectedPackaging.name}</div>
                      <div className="text-[10px] text-theme-primary font-black">
                        {selectedPackaging.price === 0 ? 'Termasuk' : `+Rp ${selectedPackaging.price.toLocaleString('id-ID')}`}
                      </div>
                    </div>
                  </div>

                  {/* 2. Kartu Ucapan & Seal */}
                  <div className="p-2 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-white border border-stone-200 shadow-2xs">
                      {selectedGreeting.imageUrl ? (
                        <img
                          src={selectedGreeting.imageUrl}
                          alt={selectedGreeting.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-base flex items-center justify-center w-full h-full">{selectedGreeting.icon}</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[8px] font-semibold text-stone-500 uppercase tracking-wider">Sertifikat Ucapan</div>
                      <div className="text-xs font-bold text-stone-800 truncate">{selectedGreeting.name}</div>
                      <div className="text-[10px] text-theme-primary font-black">
                        {selectedGreeting.price === 0 ? 'Gratis' : `+Rp ${selectedGreeting.price.toLocaleString('id-ID')}`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Aksesori Tambahan (Add-ons Visualizer) */}
                <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="text-[9px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Aksesori Tambahan ({selectedAddons.length})</span>
                    <span className="text-theme-primary font-bold">
                      {addonsTotal === 0 ? 'Tanpa Aksesori' : `+Rp ${addonsTotal.toLocaleString('id-ID')}`}
                    </span>
                  </div>

                  {selectedAddons.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {selectedAddons.map((addonId) => {
                        const found = addons.find((a) => a.id === addonId);
                        if (!found) return null;
                        return (
                          <div
                            key={found.id}
                            className="p-1 px-1.5 rounded-xl bg-white border border-stone-200/80 flex items-center gap-1.5 shadow-2xs"
                          >
                            <div className="w-7 h-7 rounded-md overflow-hidden shrink-0 bg-stone-50 border border-stone-100">
                              {found.imageUrl ? (
                                <img
                                  src={found.imageUrl}
                                  alt={found.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-xs flex items-center justify-center w-full h-full">{found.icon}</div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[10px] font-bold text-stone-800 truncate">{found.name}</div>
                              <div className="text-[8px] text-emerald-600 font-extrabold">+Rp {found.price.toLocaleString('id-ID')}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-1 text-center text-[10px] text-stone-400 font-medium">
                      Belum ada aksesori dipilih.
                    </div>
                  )}
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

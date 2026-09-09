'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MapPin,
  ExternalLink,
  Plus,
  Copy,
  Trash2,
  Search,
  Crosshair,
  Building2,
  CheckCircle2,
  X,
  Navigation,
  ShieldCheck,
} from 'lucide-react';
import { ATELIER_CONFIG, type CodPoint } from '@chenille/shared';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { showMagicToast } from '@/lib/magic-motion';
import { getApiUrl } from '@/lib/api-client';

// Presets data matching the official prototype
const COD_PRESETS: Record<
  string,
  {
    name: string;
    address: string;
    mapsUrl: string;
    distance: number;
    notes: string;
    coords: { lat: number; lng: number };
  }
> = {
  'ui-gerbatama': {
    name: 'Kampus UI Depok (Gerbatama & Rotunda)',
    address: 'Jl. Margonda Raya No. 100, Pondok Cina, Kec. Beji, Kota Depok, Jawa Barat 16424',
    mapsUrl: 'https://maps.google.com/?q=-6.3628,106.8315',
    distance: 2.4,
    notes: 'Titik serah terima buket di pos satpam Gerbatama / Lobby Rotunda Rektorat UI',
    coords: { lat: -6.3628, lng: 106.8315 },
  },
  'margo-city': {
    name: 'Margo City Mall (Lobby Utama Utara)',
    address: 'Jl. Margonda Raya No. 358, Kemiri Muka, Kec. Beji, Kota Depok, Jawa Barat 16423',
    mapsUrl: 'https://maps.google.com/?q=-6.3732,106.8345',
    distance: 3.1,
    notes: 'Tempat serah terima dekat Starbucks / Lobby Utama Drop-off Mobil',
    coords: { lat: -6.3732, lng: 106.8345 },
  },
  'stasiun-pocin': {
    name: 'Stasiun KRL Pondok Cina (Pintu Timur)',
    address: 'Pondok Cina, Kec. Beji, Kota Depok, Jawa Barat 16424',
    mapsUrl: 'https://maps.google.com/?q=-6.3688,106.8336',
    distance: 1.8,
    notes: 'Serah terima cepat di depan minimarket pintu keluar stasiun sebelah timur',
    coords: { lat: -6.3688, lng: 106.8336 },
  },
  'dmall-depok': {
    name: "D'Mall Margonda (Lobby Depan)",
    address: 'Jl. Margonda Raya No. 88, Kemiri Muka, Kec. Beji, Kota Depok, Jawa Barat 16423',
    mapsUrl: 'https://maps.google.com/?q=-6.3862,106.8285',
    distance: 3.9,
    notes: 'Serah terima di drop-off lobby depan dekat hotel Santika',
    coords: { lat: -6.3862, lng: 106.8285 },
  },
  'gunadarma-d': {
    name: 'Universitas Gunadarma (Kampus D Margonda)',
    address: 'Jl. Margonda Raya No. 100, Pondok Cina, Kec. Beji, Kota Depok, Jawa Barat 16424',
    mapsUrl: 'https://maps.google.com/?q=Universitas+Gunadarma+Kampus+D',
    distance: 1.4,
    notes: 'Titik kumpul di depan pos keamanan gerbang utama Kampus D',
    coords: { lat: -6.3692, lng: 106.8322 },
  },
};

// Margonda atelier center coordinates
const ATELIER_LAT = ATELIER_CONFIG.latitude; // -6.3728
const ATELIER_LNG = ATELIER_CONFIG.longitude; // 106.8315

// Haversine formula to compute actual distance in KM
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// Bounding box for interactive pin picker around Depok / Margonda
const MAP_BOUNDS = {
  minLat: -6.395,
  maxLat: -6.35,
  minLng: 106.81,
  maxLng: 106.855,
};

function coordsToPercent(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  return {
    x: Math.max(5, Math.min(95, x)),
    y: Math.max(5, Math.min(95, y)),
  };
}

function percentToCoords(x: number, y: number): { lat: number; lng: number } {
  const lng = MAP_BOUNDS.minLng + (x / 100) * (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng);
  const lat = MAP_BOUNDS.maxLat - (y / 100) * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);
  return { lat, lng };
}

export const CODMapModal: React.FC = () => {
  const { codPoints, addCodPoint, deleteCodPoint } = useSettingsStore();

  const [selectedPointId, setSelectedPointId] = useState<string>(
    codPoints[0]?.id || 'cod-001'
  );

  // Main Google Maps Embed view state
  const [activeEmbedQuery, setActiveEmbedQuery] = useState<string>(
    codPoints[0]?.embedQuery || codPoints[0]?.name || 'Jl. Margonda Raya No. 108 Depok'
  );
  const [activeFocusText, setActiveFocusText] = useState<string>(
    codPoints[0]
      ? `📍 Fokus Lokasi: ${codPoints[0].name} (${codPoints[0].distanceKm} KM)`
      : '📍 Fokus Lokasi: Atelier Pusat Margonda Raya'
  );
  const [activeExternalUrl, setActiveExternalUrl] = useState<string>(
    codPoints[0]?.googleMapsUrl || 'https://maps.google.com/?q=Margonda+Raya+Depok'
  );

  // Add Point Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inputSearchOrLink, setInputSearchOrLink] = useState('');
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newMapsUrl, setNewMapsUrl] = useState('');
  const [newDist, setNewDist] = useState('2.0');
  const [newNotes, setNewNotes] = useState('');
  const [modalPreviewQuery, setModalPreviewQuery] = useState('Margonda Raya Depok');

  // Interactive Pin Picker State (Drag and Drop / Click to set location)
  const [pinPos, setPinPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isDraggingPin, setIsDraggingPin] = useState(false);
  const mapCanvasRef = useRef<HTMLDivElement>(null);

  // Handler to focus a point in the main embed
  const handleFocusPoint = useCallback((point: CodPoint) => {
    setSelectedPointId(point.id);
    const query = point.embedQuery || `${point.name} ${point.fullAddress}`;
    setActiveEmbedQuery(query);
    setActiveFocusText(`📍 Fokus Lokasi: ${point.name} (${point.distanceKm} KM)`);
    setActiveExternalUrl(point.googleMapsUrl);
    showMagicToast(
      'Peta Difokuskan 📍',
      `Titik temu: ${point.name} (Jarak ~${point.distanceKm} KM dari Atelier).`,
      '🗺️'
    );
  }, []);

  // Handler to reset focus to Atelier Pusat
  const handleResetToAtelier = () => {
    setSelectedPointId('');
    setActiveEmbedQuery('Jl. Margonda Raya No. 108 Depok');
    setActiveFocusText('📍 Fokus Lokasi: Atelier Pusat Margonda Raya');
    setActiveExternalUrl('https://maps.google.com/?q=Jl.+Margonda+Raya+No.+108+Depok');
    showMagicToast(
      'Atelier Pusat 🏛️',
      'Peta kembali difokuskan pada studio produksi Margonda Raya.',
      '📍'
    );
  };

  // Handler to copy Google Maps link
  const handleCopyLink = (url: string, name: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showMagicToast(
          'Link Disalin 📋',
          `Link Google Maps untuk "${name}" berhasil disalin ke clipboard!`,
          '✅'
        );
      });
    } else {
      showMagicToast('Link Google Maps', url, 'ℹ️');
    }
  };

  // Handler to delete a COD point
  const handleDeletePoint = (point: CodPoint) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus titik temu "${point.name}" dari sistem?`
      )
    ) {
      deleteCodPoint(point.id);
      fetch(getApiUrl(`/api/v1/cod-points/${point.id}`), { method: 'DELETE' }).catch(() => {});
      showMagicToast(
        'Titik COD Dihapus 🗑️',
        `Titik temu "${point.name}" telah dihapus dari sistem.`,
        'ℹ️'
      );
      if (selectedPointId === point.id) {
        handleResetToAtelier();
      }
    }
  };

  // Open the Add COD Modal
  const openAddModal = () => {
    setInputSearchOrLink('');
    setNewName('');
    setNewAddress('');
    setNewMapsUrl('');
    setNewDist('2.0');
    setNewNotes('');
    setModalPreviewQuery('Margonda Raya Depok');
    setPinPos(coordsToPercent(ATELIER_LAT, ATELIER_LNG));
    setIsAddModalOpen(true);
  };

  // Apply a preset
  const applyPreset = (key: string) => {
    const preset = COD_PRESETS[key];
    if (!preset) return;

    setInputSearchOrLink(preset.name);
    setNewName(preset.name);
    setNewAddress(preset.address);
    setNewMapsUrl(preset.mapsUrl);
    setNewDist(preset.distance.toString());
    setNewNotes(preset.notes);
    setModalPreviewQuery(`${preset.name} Depok`);
    setPinPos(coordsToPercent(preset.coords.lat, preset.coords.lng));

    showMagicToast(
      'Preset Diterapkan ✨',
      `Data titik ${preset.name} berhasil dimuat otomatis.`,
      '🎉'
    );
  };

  // Detect Google Maps URL or query text
  const detectGoogleMapsInput = () => {
    const input = inputSearchOrLink.trim();
    if (!input) {
      showMagicToast(
        'Peringatan ⚠️',
        'Silakan ketik nama lokasi atau tempel link Google Maps terlebih dahulu.',
        '❌'
      );
      return;
    }

    let detectedName = input;
    let detectedAddress = `Sekitar ${input}, Kota Depok, Jawa Barat 16424`;
    let detectedUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      input + ' Depok'
    )}`;
    let detectedDist = (1.5 + Math.random() * 2.5).toFixed(1);
    let detectedNotes = `Janji serah terima buket di pintu masuk / lobi utama ${input}`;

    // Check if pasted link contains coordinates or shortened URL
    if (input.includes('maps.app.goo.gl') || input.includes('google.com/maps')) {
      detectedName = `Titik Temu Google Maps ${codPoints.length + 1}`;
      detectedAddress =
        'Alamat spesifik terverifikasi sesuai pin tautan Google Maps yang dibagikan';
      detectedUrl = input;

      // Try extracting coordinates if available
      const coordMatch =
        input.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
        input.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lng = parseFloat(coordMatch[2]);
        const dist = calculateDistanceKm(ATELIER_LAT, ATELIER_LNG, lat, lng);
        detectedDist = dist.toFixed(1);
        setPinPos(coordsToPercent(lat, lng));
      }
    } else {
      // Look up preset if matches
      const matchedKey = Object.keys(COD_PRESETS).find(
        (k) =>
          COD_PRESETS[k].name.toLowerCase().includes(input.toLowerCase()) ||
          input.toLowerCase().includes(k)
      );
      if (matchedKey) {
        applyPreset(matchedKey);
        return;
      }
    }

    setNewName(detectedName);
    setNewAddress(detectedAddress);
    setNewMapsUrl(detectedUrl);
    setNewDist(detectedDist);
    setNewNotes(detectedNotes);
    setModalPreviewQuery(`${input} Depok`);

    showMagicToast(
      'Lokasi Terdeteksi 📍',
      'Alamat, estimasi jarak, dan link Google Maps berhasil disiapkan!',
      '✅'
    );
  };

  // Test opening the Google Maps link
  const testOpenMapsLink = () => {
    const url = newMapsUrl.trim();
    if (url) {
      window.open(url, '_blank');
    } else {
      showMagicToast(
        'Link Kosong ⚠️',
        'Belum ada link Google Maps yang terisi.',
        '❌'
      );
    }
  };

  // Update pin position from coordinates and recalculate distance & address
  const updateLocationFromCoords = useCallback(
    (lat: number, lng: number) => {
      const dist = calculateDistanceKm(ATELIER_LAT, ATELIER_LNG, lat, lng);
      setNewDist(dist.toFixed(1));
      const mapsUrl = `https://www.google.com/maps?q=${lat.toFixed(5)},${lng.toFixed(5)}`;
      setNewMapsUrl(mapsUrl);
      setModalPreviewQuery(`${lat.toFixed(5)},${lng.toFixed(5)}`);

      // Check proximity to landmarks
      let landmarkName = '';
      for (const [_, preset] of Object.entries(COD_PRESETS)) {
        const d = calculateDistanceKm(lat, lng, preset.coords.lat, preset.coords.lng);
        if (d <= 0.6) {
          landmarkName = preset.name;
          break;
        }
      }

      if (landmarkName) {
        if (!newName || newName.startsWith('Titik Pin') || newName.startsWith('Titik Temu COD')) {
          setNewName(`Dekat ${landmarkName}`);
        }
        setNewAddress(
          `Area sekitar ${landmarkName}, Jl. Margonda Raya, Beji, Kota Depok, Jawa Barat 16424 (Koordinat: ${lat.toFixed(
            4
          )}, ${lng.toFixed(4)})`
        );
      } else {
        if (!newName) {
          setNewName(`Titik Temu COD (${dist.toFixed(1)} KM)`);
        }
        setNewAddress(
          `Jl. Margonda Raya & Sekitarnya, Beji, Kota Depok, Jawa Barat 16424 (Koordinat: ${lat.toFixed(
            4
          )}, ${lng.toFixed(4)})`
        );
      }

      if (!newNotes) {
        setNewNotes(
          `Serah terima buket di lobi depan / titik temu koordinat Google Maps (${dist.toFixed(
            1
          )} KM)`
        );
      }
    },
    [newName, newNotes]
  );

  // Drag and drop & Click handling on the Interactive Map Canvas
  const handleMapPointerAction = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!mapCanvasRef.current) return;
    const rect = mapCanvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(5, Math.min(95, rawX));
    const clampedY = Math.max(5, Math.min(95, rawY));

    setPinPos({ x: clampedX, y: clampedY });
    const coords = percentToCoords(clampedX, clampedY);
    updateLocationFromCoords(coords.lat, coords.lng);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingPin || !mapCanvasRef.current) return;
      const rect = mapCanvasRef.current.getBoundingClientRect();
      const rawX = ((e.clientX - rect.left) / rect.width) * 100;
      const rawY = ((e.clientY - rect.top) / rect.height) * 100;
      const clampedX = Math.max(5, Math.min(95, rawX));
      const clampedY = Math.max(5, Math.min(95, rawY));

      setPinPos({ x: clampedX, y: clampedY });
      const coords = percentToCoords(clampedX, clampedY);
      updateLocationFromCoords(coords.lat, coords.lng);
    };

    const handleMouseUp = () => {
      if (isDraggingPin) {
        setIsDraggingPin(false);
      }
    };

    if (isDraggingPin) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPin, updateLocationFromCoords]);

  // Save new COD point to store
  const saveNewCodPoint = () => {
    const name = newName.trim();
    const address = newAddress.trim();
    const mapsUrl =
      newMapsUrl.trim() ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        name + ' Depok'
      )}`;
    const dist = parseFloat(newDist) || 2.0;
    const notes = newNotes.trim() || 'Titik temu serah terima buket kawat bulu';

    if (!name) {
      showMagicToast(
        'Validasi Gagal ⚠️',
        'Mohon isi nama titik temu atau tentukan lokasi dari peta!',
        '❌'
      );
      return;
    }

    const savedPoint = addCodPoint({
      name,
      fullAddress: address || `Area sekitar ${name}, Depok`,
      googleMapsUrl: mapsUrl,
      embedQuery: modalPreviewQuery || name,
      distanceKm: dist,
      deliveryNotes: notes,
      isActive: true,
    });

    fetch(getApiUrl('/api/v1/cod-points'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        full_address: address || `Area sekitar ${name}, Depok`,
        google_maps_url: mapsUrl,
        distance_km: dist,
        delivery_notes: notes,
      }),
    }).catch((err) => console.warn('Could not sync COD point to DB:', err));

    setIsAddModalOpen(false);
    handleFocusPoint(savedPoint);

    showMagicToast(
      'Titik COD Ditambahkan 🎉',
      `Titik temu "${name}" berhasil didaftarkan dan dapat langsung digunakan pelanggan.`,
      '✨'
    );
  };

  const atelierPos = coordsToPercent(ATELIER_LAT, ATELIER_LNG);

  return (
    <div className="space-y-6">
      {/* ==========================================================================
          VIEW: TITIK TEMU COD MAPS & GEOFENCING ATELIER
          ========================================================================== */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        {/* PANEL HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#EA4335] flex items-center justify-center shadow-xs">
                <MapPin className="w-5 h-5 fill-rose-100" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
                Titik Temu COD Google Maps & Geofencing Atelier
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Kelola titik serah terima buket kawat bulu tanpa ongkir dengan link Google Maps resmi dan estimasi jarak radius 5.0 KM.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleResetToAtelier}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Crosshair className="w-3.5 h-3.5 text-stone-600" />
              <span>Atelier Pusat</span>
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Titik Temu via Google Maps</span>
            </button>
          </div>
        </div>

        {/* STATUS BAR COD GEOFENCING */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10.5px] text-stone-400 font-bold uppercase tracking-wider">
                ATELIER PUSAT PRODUKSI
              </div>
              <div className="text-xs font-extrabold text-stone-800">
                Jl. Margonda Raya No. 108 Depok
              </div>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10.5px] text-stone-400 font-bold uppercase tracking-wider">
                RADIUS BEBAS ONGKIR
              </div>
              <div className="text-xs font-extrabold text-emerald-600">
                Maksimal 5.0 KM (Rp 0 Ongkir)
              </div>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10.5px] text-stone-400 font-bold uppercase tracking-wider">
                TOTAL TITIK TERVERIFIKASI
              </div>
              <div className="text-xs font-extrabold text-purple-600">
                {codPoints.length} Titik Temu Aktif
              </div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN MAIN COD LAYOUT */}
        <div className="cod-layout">
          {/* LEFT: REAL GOOGLE MAPS EMBED */}
          <div className="flex flex-col gap-3">
            <div className="relative rounded-2xl overflow-hidden border-2 border-stone-200 h-[460px] shadow-sm bg-slate-100">
              <iframe
                title="Google Maps Live View"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  activeEmbedQuery
                )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-none"
                allowFullScreen
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl text-xs flex justify-between items-center shadow-lg border border-slate-700/50">
                <span className="font-semibold truncate mr-2">{activeFocusText}</span>
                <a
                  href={activeExternalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-300 hover:text-cyan-200 font-bold flex items-center gap-1 flex-shrink-0 transition-colors"
                >
                  <span>Buka Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: COD POINTS LIST */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs sm:text-sm font-extrabold text-stone-800">
                Daftar Titik Temu Resmi Terverifikasi
              </h4>
              <span className="text-[11px] text-stone-400">
                Klik titik untuk fokus di peta
              </span>
            </div>

            <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto pr-1">
              {codPoints.map((pt) => {
                const isSelected = selectedPointId === pt.id;
                const isFree = pt.distanceKm <= ATELIER_CONFIG.maxFreeCodRadiusKm;

                return (
                  <div
                    key={pt.id}
                    onClick={() => handleFocusPoint(pt)}
                    className={`cod-card ${isSelected ? 'active-pin ring-2 ring-rose-400/50' : ''}`}
                  >
                    <div className="cod-card-title">
                      <div className="flex items-center gap-2">
                        <span className="text-[#EA4335] text-sm">📍</span>
                        <strong className="text-stone-800 text-xs sm:text-sm">
                          {pt.name}
                        </strong>
                      </div>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                          isFree
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isFree ? 'Gratis Ongkir' : 'Tarif Standar'}
                      </span>
                    </div>

                    <div className="cod-card-address">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                      <span>{pt.fullAddress}</span>
                    </div>

                    <div className="cod-card-meta">
                      <span>✓ Jarak {pt.distanceKm} KM dari Atelier</span>
                      <span>•</span>
                      <span>{isFree ? 'Bebas Ongkir (Rp 0)' : 'Tarif Standar'}</span>
                      {pt.deliveryNotes && (
                        <>
                          <span>•</span>
                          <span className="text-stone-400 font-normal italic">
                            {pt.deliveryNotes}
                          </span>
                        </>
                      )}
                    </div>

                    <div
                      className="cod-card-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="btn-cod-action"
                        onClick={() => handleFocusPoint(pt)}
                        title="Lihat lokasi di peta embed"
                      >
                        <Crosshair className="w-3 h-3 text-rose-500" />
                        <span>Fokus di Peta</span>
                      </button>

                      <a
                        href={pt.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-cod-action"
                        style={{
                          color: '#2563EB',
                          borderColor: '#BFDBFE',
                          background: '#EFF6FF',
                        }}
                        title="Buka di tab baru Google Maps"
                      >
                        <ExternalLink className="w-3 h-3 text-blue-600" />
                        <span>Buka Google Maps ↗</span>
                      </a>

                      <button
                        type="button"
                        className="btn-cod-action"
                        onClick={() => handleCopyLink(pt.googleMapsUrl, pt.name)}
                        title="Salin link Google Maps untuk dikirim ke WhatsApp pembeli"
                      >
                        <Copy className="w-3 h-3 text-stone-500" />
                        <span>Salin Link</span>
                      </button>

                      <button
                        type="button"
                        className="btn-cod-action btn-danger-action"
                        onClick={() => handleDeletePoint(pt)}
                        title="Hapus titik COD ini"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          MODAL: DAFTAR TITIK TEMU COD VIA GOOGLE MAPS
          ========================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-[#EA4335] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-stone-800">
                  Daftarkan Titik COD Baru via Google Maps
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* SEARCH & DETECT BOX */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-2.5">
                <label className="text-xs font-extrabold text-stone-800 block">
                  🔍 Cari Lokasi atau Tempel Link Google Maps:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputSearchOrLink}
                    onChange={(e) => setInputSearchOrLink(e.target.value)}
                    placeholder="Tempel link https://maps.app.goo.gl/... atau ketik nama gedung/mall..."
                    className="flex-1 px-3 py-2 border border-stone-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        detectGoogleMapsInput();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={detectGoogleMapsInput}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Deteksi Maps</span>
                  </button>
                </div>

                {/* PRESET CHIPS */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10.5px] font-bold text-stone-400">
                    Preset Populer:
                  </span>
                  <button
                    type="button"
                    className="canned-chip"
                    onClick={() => applyPreset('ui-gerbatama')}
                  >
                    🏛️ UI Gerbatama
                  </button>
                  <button
                    type="button"
                    className="canned-chip"
                    onClick={() => applyPreset('margo-city')}
                  >
                    🛍️ Margo City
                  </button>
                  <button
                    type="button"
                    className="canned-chip"
                    onClick={() => applyPreset('stasiun-pocin')}
                  >
                    🚉 Stasiun Pocin
                  </button>
                  <button
                    type="button"
                    className="canned-chip"
                    onClick={() => applyPreset('dmall-depok')}
                  >
                    🏬 D&apos;Mall Margonda
                  </button>
                  <button
                    type="button"
                    className="canned-chip"
                    onClick={() => applyPreset('gunadarma-d')}
                  >
                    🎓 Gunadarma Kampus D
                  </button>
                </div>
              </div>

              {/* INTERACTIVE DRAG & DROP PIN LOCATION PICKER */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-rose-500" />
                    <span>Atur Pin Lokasi (Geser Pin / Klik Peta Interaktif):</span>
                  </label>
                  <span className="text-[10px] text-stone-400 font-medium">
                    Radius Margonda Depok • Auto-calc KM & Maps URL
                  </span>
                </div>

                {/* Canvas Box */}
                <div
                  ref={mapCanvasRef}
                  onClick={handleMapPointerAction}
                  className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-dashed border-rose-200 bg-slate-900 cursor-crosshair select-none shadow-inner"
                  style={{
                    backgroundImage:
                      'radial-gradient(#334155 1px, transparent 1px), linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    backgroundSize: '16px 16px, cover',
                  }}
                >
                  {/* Decorative Geofence Radius Circle (5 KM) */}
                  <div
                    className="absolute rounded-full border border-emerald-400/40 pointer-events-none"
                    style={{
                      width: '280px',
                      height: '280px',
                      left: `${atelierPos.x}%`,
                      top: `${atelierPos.y}%`,
                      transform: 'translate(-50%, -50%)',
                      background:
                        'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
                    }}
                  />

                  {/* Atelier Pusat Marker */}
                  <div
                    className="absolute pointer-events-none z-10 flex flex-col items-center"
                    style={{
                      left: `${atelierPos.x}%`,
                      top: `${atelierPos.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">
                      🏢
                    </div>
                    <span className="text-[9px] font-extrabold text-emerald-300 mt-0.5 bg-slate-900/80 px-1 rounded">
                      Atelier Margonda
                    </span>
                  </div>

                  {/* Landmark Presets Markers on Map */}
                  {Object.entries(COD_PRESETS).map(([key, preset]) => {
                    const pos = coordsToPercent(preset.coords.lat, preset.coords.lng);
                    return (
                      <div
                        key={key}
                        onClick={(e) => {
                          e.stopPropagation();
                          applyPreset(key);
                        }}
                        className="absolute z-10 cursor-pointer group flex flex-col items-center"
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        title={`Klik untuk snap ke ${preset.name}`}
                      >
                        <div className="w-4 h-4 rounded-full bg-blue-500/80 border border-white group-hover:scale-125 transition-transform flex items-center justify-center text-[8px] text-white">
                          📍
                        </div>
                        <span className="text-[8.5px] font-semibold text-slate-300 opacity-70 group-hover:opacity-100 bg-slate-900/90 px-1 rounded whitespace-nowrap mt-0.5 transition-opacity">
                          {preset.name.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}

                  {/* Draggable Current Pin Marker */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setIsDraggingPin(true);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      setIsDraggingPin(true);
                    }}
                    className="absolute z-20 cursor-grab active:cursor-grabbing flex flex-col items-center -translate-x-1/2 -translate-y-full transition-transform"
                    style={{
                      left: `${pinPos.x}%`,
                      top: `${pinPos.y}%`,
                    }}
                  >
                    <div className="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap mb-0.5 animate-pulse border border-rose-300">
                      Geser Pin Ini 📍
                    </div>
                    <div className="w-8 h-8 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white animate-bounce">
                      <MapPin className="w-4 h-4 fill-white" />
                    </div>
                  </div>

                  {/* Info Badge at Top Right */}
                  <div className="absolute top-2 right-2 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-lg border border-slate-700/60 font-mono">
                    Jarak: <strong className="text-emerald-400">{newDist} KM</strong> dari Atelier
                  </div>
                </div>
              </div>

              {/* DETAIL TITIK FORM INPUTS */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Nama Titik / Tempat Temu:
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Gedung Rektorat UI / Lobby Margo City..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Alamat Lengkap Google Maps:
                  </label>
                  <textarea
                    rows={2}
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Alamat lengkap terdeteksi dari Google Maps..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Link Google Maps (Share URL):
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={newMapsUrl}
                        onChange={(e) => setNewMapsUrl(e.target.value)}
                        placeholder="https://maps.google.com/?q=..."
                        className="flex-1 px-3 py-2 border border-stone-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={testOpenMapsLink}
                        title="Buka & Cek di Tab Baru"
                        className="px-2.5 py-2 text-xs font-bold bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                      >
                        ↗
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Estimasi Jarak dari Atelier (KM):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newDist}
                      onChange={(e) => setNewDist(e.target.value)}
                      placeholder="2.5"
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Catatan Khusus Titik Penyerahan Buket:
                  </label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Contoh: Pembeli menunggu di lobi depan Starbucks / Pos Satpam..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* PRATINJAU GOOGLE MAPS EMBED */}
                <div>
                  <label className="text-[11px] font-bold text-stone-500 block mb-1">
                    Pratinjau Pin Google Maps:
                  </label>
                  <div className="h-36 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                    <iframe
                      title="Modal Google Maps Preview"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        modalPreviewQuery || 'Margonda Raya Depok'
                      )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-full border-none"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="px-5 py-4 border-t border-stone-100 flex justify-end items-center gap-2.5 bg-stone-50/70">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-200/70 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveNewCodPoint}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simpan Titik COD ke Sistem</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  MapPin,
  Crosshair,
  ZoomIn,
  ZoomOut,
  Layers,
  RotateCw,
  CheckCircle2,
  Compass,
  Move,
  Info,
} from 'lucide-react';

interface InteractiveMapPickerProps {
  latitude: number | string;
  longitude: number | string;
  radiusKm?: number;
  showRadius?: boolean;
  onLocationChange: (lat: string, lng: string, resolvedAddress?: string) => void;
  className?: string;
  height?: string;
  readOnly?: boolean;
  label?: string;
}

export const InteractiveMapPicker: React.FC<InteractiveMapPickerProps> = ({
  latitude,
  longitude,
  radiusKm = 5.0,
  showRadius = false,
  onLocationChange,
  className = '',
  height = '360px',
  readOnly = false,
  label = 'Peta Interaktif (Explore & Set Pin Otomatis)',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');
  const [tileLayerRef, setTileLayerRef] = useState<any>(null);

  // Normalize initial lat and lng
  const parsedLat = parseFloat(String(latitude)) || -6.8971;
  const parsedLng = parseFloat(String(longitude)) || 107.5608;

  // Reverse geocoding helper
  const performReverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      setIsDetecting(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat.toFixed(6)}&lon=${lng.toFixed(6)}&addressdetails=1`,
          { headers: { 'User-Agent': 'ChenilleAtelier/2.5' } }
        );
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          const road = addr.road || addr.building || addr.amenity || addr.commercial;
          const village = addr.village || addr.suburb || addr.neighbourhood;
          const district = addr.city_district || addr.county;
          const city = addr.city || addr.town || addr.municipality;
          const state = addr.state;
          const postcode = addr.postcode;

          const parts = [
            road,
            village && village !== road ? village : '',
            district ? (district.toLowerCase().startsWith('kec') ? district : `Kec. ${district}`) : '',
            city ? (city.startsWith('Kota') || city.startsWith('Kab') ? city : `Kota ${city}`) : '',
            state,
            postcode,
          ].filter(Boolean);

          const fullAddress = parts.join(', ') || data.display_name;
          setCurrentAddress(fullAddress);
          return fullAddress;
        }
      } catch (err) {
        console.warn('Reverse geocode error:', err);
      } finally {
        setIsDetecting(false);
      }
      return '';
    },
    []
  );

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    const initLeaflet = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return; // already initialized

      try {
        const L = (await import('leaflet')).default;

        // Red Pin Teardrop Marker matching Google Maps aesthetic
        const redPinIcon = L.divIcon({
          className: 'custom-pin-marker',
          html: `
            <div style="position: relative; width: 38px; height: 38px; transform: translate(-50%, -100%); cursor: ${readOnly ? 'default' : 'grab'}; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));">
              <svg viewBox="0 0 24 24" width="38" height="38" fill="#EA4335" stroke="#FFFFFF" stroke-width="1">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
              </svg>
              <div style="width: 10px; height: 4px; background: rgba(0,0,0,0.35); border-radius: 50%; position: absolute; bottom: -2px; left: 14px; filter: blur(1px);"></div>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 38],
        });

        const map = L.map(mapContainerRef.current, {
          center: [parsedLat, parsedLng],
          zoom: 16,
          zoomControl: false, // we will render sleek modern controls
          attributionControl: false,
        });

        // Add base tile layer (OpenStreetMap)
        const streetTiles = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            subdomains: ['a', 'b', 'c'],
          }
        );
        streetTiles.addTo(map);
        setTileLayerRef(streetTiles);

        // Add Draggable Marker
        const marker = L.marker([parsedLat, parsedLng], {
          icon: redPinIcon,
          draggable: !readOnly,
          autoPan: true,
        }).addTo(map);

        markerRef.current = marker;

        // Radius circle if requested
        if (showRadius && radiusKm) {
          const circle = L.circle([parsedLat, parsedLng], {
            radius: radiusKm * 1000,
            color: '#e11d48',
            weight: 2,
            opacity: 0.8,
            fillColor: '#fda4af',
            fillOpacity: 0.15,
            dashArray: '6, 6',
          }).addTo(map);
          circleRef.current = circle;
        }

        // Event: Marker Dragged
        if (!readOnly) {
          marker.on('dragend', async () => {
            const pos = marker.getLatLng();
            const latStr = pos.lat.toFixed(6);
            const lngStr = pos.lng.toFixed(6);

            if (circleRef.current) {
              circleRef.current.setLatLng(pos);
            }

            const addr = await performReverseGeocode(pos.lat, pos.lng);
            onLocationChange(latStr, lngStr, addr);
          });

          // Event: Map Click to Drop / Move Pin
          map.on('click', async (e: any) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);

            if (circleRef.current) {
              circleRef.current.setLatLng([lat, lng]);
            }

            const latStr = lat.toFixed(6);
            const lngStr = lng.toFixed(6);
            const addr = await performReverseGeocode(lat, lng);
            onLocationChange(latStr, lngStr, addr);
          });
        }

        mapInstanceRef.current = map;
        if (isMounted) setIsMapReady(true);
      } catch (e) {
        console.warn('Failed to load Leaflet:', e);
      }
    };

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker position and view when latitude / longitude props change from outside
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;

    const lat = parseFloat(String(latitude));
    const lng = parseFloat(String(longitude));
    if (isNaN(lat) || isNaN(lng)) return;

    const currentPos = markerRef.current.getLatLng();
    // Only update if difference is more than ~1 meter
    if (
      Math.abs(currentPos.lat - lat) > 0.00005 ||
      Math.abs(currentPos.lng - lng) > 0.00005
    ) {
      markerRef.current.setLatLng([lat, lng]);
      if (circleRef.current) {
        circleRef.current.setLatLng([lat, lng]);
      }
      mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.0 });
    }
  }, [latitude, longitude]);

  // Update radius circle if radiusKm changes
  useEffect(() => {
    if (!circleRef.current || !radiusKm) return;
    circleRef.current.setRadius(radiusKm * 1000);
  }, [radiusKm]);

  // Handle map style switch (Streets vs Satellite)
  const toggleMapStyle = async () => {
    if (!mapInstanceRef.current || typeof window === 'undefined') return;
    const L = (await import('leaflet')).default;

    const nextStyle = mapStyle === 'streets' ? 'satellite' : 'streets';
    setMapStyle(nextStyle);

    if (tileLayerRef) {
      mapInstanceRef.current.removeLayer(tileLayerRef);
    }

    let newTileLayer;
    if (nextStyle === 'satellite') {
      // Esri World Imagery Satellite Tiles (100% Free & Open)
      newTileLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      );
    } else {
      newTileLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19, subdomains: ['a', 'b', 'c'] }
      );
    }

    newTileLayer.addTo(mapInstanceRef.current);
    setTileLayerRef(newTileLayer);
  };

  // Center on current pin
  const handleRecenter = () => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    const pos = markerRef.current.getLatLng();
    mapInstanceRef.current.flyTo(pos, 16, { duration: 0.8 });
  };

  // GPS Device Locator
  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current || !markerRef.current) return;
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        markerRef.current.setLatLng([lat, lng]);
        if (circleRef.current) circleRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1.2 });

        const latStr = lat.toFixed(6);
        const lngStr = lng.toFixed(6);
        const addr = await performReverseGeocode(lat, lng);
        onLocationChange(latStr, lngStr, addr);
        setIsDetecting(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsDetecting(false);
      }
    );
  };

  return (
    <div className={`relative rounded-2xl border border-stone-200 overflow-hidden shadow-xs bg-stone-100 ${className}`}>
      {/* HEADER / TOOLBAR */}
      <div className="bg-white/95 backdrop-blur-xs px-3.5 py-2 border-b border-stone-200 flex items-center justify-between gap-2 z-10 relative">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
          <span className="text-[11.5px] font-black text-stone-800 tracking-tight truncate">
            {label}
          </span>
          {isDetecting && (
            <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md shrink-0">
              <RotateCw className="w-3 h-3 animate-spin" />
              Mendeteksi Alamat...
            </span>
          )}
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={toggleMapStyle}
            className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10.5px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="Ganti tampilan peta Jalan atau Satelit"
          >
            <Layers className="w-3 h-3 text-stone-500" />
            <span className="hidden sm:inline">{mapStyle === 'streets' ? 'Satelit' : 'Jalan'}</span>
          </button>

          {!readOnly && (
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isDetecting}
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              title="Arahkan ke GPS perangkat saya"
            >
              <Crosshair className="w-3.5 h-3.5 text-rose-600" />
            </button>
          )}

          <button
            type="button"
            onClick={handleRecenter}
            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            title="Pusatkan peta ke Pin"
          >
            <Compass className="w-3.5 h-3.5 text-stone-600" />
          </button>

          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            title="Perbesar Peta"
          >
            <ZoomIn className="w-3.5 h-3.5 text-stone-600" />
          </button>

          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            title="Perkecil Peta"
          >
            <ZoomOut className="w-3.5 h-3.5 text-stone-600" />
          </button>
        </div>
      </div>

      {/* MAP CANVAS CONTAINER */}
      <div
        ref={mapContainerRef}
        style={{ height }}
        className="w-full relative z-0 cursor-crosshair"
      />

      {/* FLOATING HELPER BADGE */}
      {!readOnly && (
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 pointer-events-none flex items-center justify-between gap-2">
          <div className="bg-stone-900/80 backdrop-blur-md text-white text-[10.5px] px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 pointer-events-auto">
            <Move className="w-3 h-3 text-rose-400 shrink-0" />
            <span className="font-semibold">
              <b>Geser pin merah 📍</b> atau <b>klik di mana saja</b> untuk set lokasi otomatis.
            </span>
          </div>

          <div className="bg-white/90 backdrop-blur-md text-stone-700 text-[10.5px] font-mono px-2.5 py-1 rounded-lg border border-stone-200 shadow-sm shrink-0 pointer-events-auto hidden sm:block">
            {parsedLat.toFixed(5)}, {parsedLng.toFixed(5)}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMapPicker;

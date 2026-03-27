"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const REGIONS: Record<string, { coords: [number, number], label: string, sessions: number }> = {
  "lagos": { coords: [6.5244, 3.3792], label: "LAGOS", sessions: 420 },
  "abuja": { coords: [9.0579, 7.4951], label: "ABUJA", sessions: 112 },
  "kano": { coords: [12.0022, 8.5920], label: "KANO", sessions: 85 },
  "port harcourt": { coords: [4.8156, 7.0498], label: "PORT HARCOURT", sessions: 156 },
};

const NIGERIA_CENTER: [number, number] = [9.0820, 8.6753];

// Helper to create HTML icons mapping
function createCustomIcon(regionKey: string) {
  const data = REGIONS[regionKey];
  const isLagos = regionKey === "lagos";
  
  const html = `
    <div class="relative group cursor-pointer flex flex-col items-center drop-shadow-md hover:scale-110 transition-transform">
       <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded shadow-sm mb-1 whitespace-nowrap">
         <span class="text-[10px] font-black uppercase tracking-tight text-slate-800 dark:text-white">${data.label}: ${data.sessions}</span>
       </div>
       <div class="${isLagos ? 'w-4 h-4 bg-[#0f5a34]' : 'w-3 h-3 bg-emerald-500'} rounded-full border-2 border-white dark:border-slate-800 shadow-md"></div>
    </div>
  `;
  return L.divIcon({ html, className: "", iconSize: [80, 40], iconAnchor: [40, 40] });
}

function MapUpdater({ view }: { view: string }) {
  const map = useMap();
  useEffect(() => {
    if (view === "global") {
      map.flyTo(NIGERIA_CENTER, 6, { duration: 1.5 });
    } else if (REGIONS[view]) {
      map.flyTo(REGIONS[view].coords, 11, { duration: 1.5 });
    }
  }, [view, map]);
  return null;
}

export default function LeafletMap({ view }: { view: string }) {
  const tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <MapContainer 
      center={REGIONS["lagos"].coords} 
      zoom={11} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url={tileUrl} />
      <MapUpdater view={view} />
      
      {/* Render all region pins */}
      {Object.entries(REGIONS).map(([key, data]) => (
        <Marker key={key} position={data.coords} icon={createCustomIcon(key)} />
      ))}
    </MapContainer>
  );
}


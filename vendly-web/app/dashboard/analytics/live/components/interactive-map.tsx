"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the map disabled SSR because leaflet needs the window object
const Map = dynamic(() => import("./map"), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50">
      <Loader2 className="animate-spin text-green-600" size={32} />
    </div>
  )
});

export default function InteractiveMap({ view }: { view: string }) {
  return <Map view={view} />;
}

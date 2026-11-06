"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

export interface MapCentrePin {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  complianceScore: number;
  complianceGrade: string;
  capacity: number;
}

interface ComplianceMapProps {
  centres: MapCentrePin[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
}

export default function ComplianceMap({
  centres,
  centerLat = 22.5937,
  centerLng = 78.9629,
  zoom = 5,
}: ComplianceMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    // Dynamically load leaflet and CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    import("leaflet").then((L) => {
      if (!mapContainerRef.current) return;

      // Reset previous map if existing
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapContainerRef.current).setView([centerLat, centerLng], zoom);
      mapInstanceRef.current = map;

      // OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Create Custom SVG Div Icons based on compliance score
      centres.forEach((centre) => {
        let pinColor = "#10b981"; // Emerald / Compliant
        if (centre.complianceScore < 60) {
          pinColor = "#ef4444"; // Red / Critical
        } else if (centre.complianceScore < 80) {
          pinColor = "#f59e0b"; // Amber / Partial
        }

        const customIcon = L.divIcon({
          className: "custom-pin",
          html: `
            <div style="
              background-color: ${pinColor};
              width: 28px;
              height: 28px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="
                transform: rotate(45deg);
                color: white;
                font-weight: bold;
                font-size: 10px;
              ">${Math.round(centre.complianceScore)}</span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -28],
        });

        const popupContent = `
          <div style="font-family: sans-serif; min-width: 180px; padding: 4px;">
            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase;">${centre.code}</div>
            <div style="font-weight: bold; font-size: 13px; color: #0f172a; margin-bottom: 4px;">${centre.name}</div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">${centre.district}, ${centre.state}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 6px 8px; border-radius: 6px; margin-bottom: 8px;">
              <span style="font-size: 11px; color: #64748b;">Compliance:</span>
              <span style="font-size: 12px; font-weight: bold; color: ${pinColor};">${centre.complianceScore}%</span>
            </div>
            <a href="/centres/${centre.id}" style="
              display: block;
              text-align: center;
              background-color: #1d4ed8;
              color: white;
              text-decoration: none;
              padding: 5px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 500;
            ">View Centre Details →</a>
          </div>
        `;

        L.marker([centre.latitude, centre.longitude], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [centres, centerLat, centerLng, zoom]);

  return (
    <div className="relative w-full h-[420px] rounded-lg overflow-hidden border border-slate-200 shadow-sm dark:border-slate-800">
      <div ref={mapContainerRef} className="w-full h-full" />
      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-[400] bg-white/95 dark:bg-slate-900/95 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-md text-xs space-y-1.5 backdrop-blur">
        <div className="font-semibold text-slate-700 dark:text-slate-200 text-[11px]">Compliance Status</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-600 dark:text-slate-400">Compliant (≥80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-slate-600 dark:text-slate-400">Partial (60-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span className="text-slate-600 dark:text-slate-400">Critical (&lt;60%)</span>
        </div>
      </div>
    </div>
  );
}

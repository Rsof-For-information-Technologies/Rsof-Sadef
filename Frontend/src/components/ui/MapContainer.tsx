"use client";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { Location } from "@/app/data/locations";

interface IconDefaultPrototype {
  _getIconUrl?: () => string;
}

interface MapContainerProps {
  locations: Location[];
  activeLocation: number | null;
  setActiveLocation: (id: number) => void;
}

let L: typeof import("leaflet") | null = null;

const MapContainer: React.FC<MapContainerProps> = ({
  locations,
  activeLocation,
  setActiveLocation,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: number]: L.Marker }>({});
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadLeaflet() {
      const cssId = "leaflet-css";
      if (!document.getElementById(cssId)) {
        const link = document.createElement("link");
        link.id = cssId;
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      const leaflet = await import("leaflet");

      if (mounted) {
        L = leaflet;
        setLeafletLoaded(true);
      }
    }

    loadLeaflet();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !L) return;

    delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/images/marker-icon-2x.png",
      iconUrl: "/images/marker-icon.png",
      shadowUrl: "/images/marker-shadow.png",
    });

    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [24.0, 45.0],
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      locations.forEach((location) => {
        if (!L) return;
        const customIcon = L.divIcon({
          className: "custom-div-icon",
          html: `
                <div style="background-color: #7D5A42; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; position: relative;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="white" width="16" height="16">
                        <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
                    </svg>
                    ${
                      location.id === activeLocation
                        ? `<div style="position: absolute; top: -40px; right: -50px; background-color: #7D5A42; color: white; padding: 8px 12px; border-radius: 4px; min-width: 100px; text-align: center;">${location.name}</div>`
                        : ""
                    }
                </div>
            `,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        const marker = L.marker(location.coordinates, { icon: customIcon })
          .addTo(mapRef.current!)
          .on("click", () => {
            setActiveLocation(location.id);
            mapRef.current?.panTo(location.coordinates);
          });

        markersRef.current[location.id] = marker;
      });
    }

    if (activeLocation !== null) {
      const activeLocationData = locations.find((l) => l.id === activeLocation);
      if (activeLocationData) {
        mapRef.current?.panTo(activeLocationData.coordinates);

        Object.keys(markersRef.current).forEach((key) => {
          const id = Number.parseInt(key);
          const marker = markersRef.current[id];

          if (!L) return;

          const customIcon = L.divIcon({
            className: "custom-div-icon",
            html: `
                    <div style="background-color: #7D5A42; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; position: relative;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="white" width="16" height="16">
                            <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
                        </svg>
                        ${
                          id === activeLocation
                            ? `<div style="position: absolute; top: -40px; right: -50px; background-color: #7D5A42; color: white; padding: 8px 12px; border-radius: 4px; min-width: 100px; text-align: center;">${
                                locations.find((l) => l.id === id)?.name
                              }</div>`
                            : ""
                        }
                    </div>
                `,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          });

          marker.setIcon(customIcon);
        });
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletLoaded, locations, activeLocation, setActiveLocation]);

  if (!leafletLoaded)
    return (
      <div className="h-full w-full flex items-center justify-center">
        Loading map…
      </div>
    );

  return <div id="map" className="h-[500px] w-full rounded-lg"></div>;
};

export default MapContainer;

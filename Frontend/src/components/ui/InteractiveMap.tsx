"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import type { Location } from "@/app/data/locations";

const MapComponent = dynamic(() => import('@/components/ui/MapContainer'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-black">Loading map...</div>
    </div>
});

type InteractiveMapProps = {
    longitude: number;
    latitute: number;
}

const InteractiveMap = ({ latitute, longitude }: InteractiveMapProps) => {
    const [activeLocation, setActiveLocation] = useState<number | null>(1);

    // Create a single location object
    const singleLocation: Location[] = [
        {
            id: 1,
            name: "Your Location",
            coordinates: [Number(latitute), Number(longitude)],
        }
    ];

    return (
        <section className="py-4 md:py-4">
            <div className="container mx-auto px-0">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <MapComponent
                            locations={singleLocation}
                            activeLocation={1}
                            setActiveLocation={() => {}}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InteractiveMap;

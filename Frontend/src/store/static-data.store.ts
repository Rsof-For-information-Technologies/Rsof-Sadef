"use client";

import { create } from "zustand";
import { getAllPropertyCities, getAllPropertyFeatures, getAllPropertyStatuses, getAllPropertyTypes, getAllPropertyUnitCategories } from "@/utils/api";
import { PropertyEnumItem } from "@/types/staticData";

interface StaticDataState {
    cities: PropertyEnumItem[];
    propertyTypes: PropertyEnumItem[];
    propertyStatuses: PropertyEnumItem[];
    unitCategories: PropertyEnumItem[];
    features: PropertyEnumItem[];
    lastFetched: Date | null;
    isLoading: boolean;
    error: string | null;
    fetchStaticData: () => Promise<void>;
}

// Cache duration in milliseconds (e.g., 1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

export const useStaticDataStore = create<StaticDataState>((set, get) => ({
    cities: [],
    propertyTypes: [],
    propertyStatuses: [],
    unitCategories: [],
    features: [],
    lastFetched: null,
    isLoading: false,
    error: null,

    fetchStaticData: async () => {
        const lastFetched = get().lastFetched;
        const now = new Date();

        if (lastFetched && now.getTime() - lastFetched.getTime() < CACHE_DURATION) {
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const [
                citiesResponse,
                typesResponse,
                statusesResponse,
                categoriesResponse,
                featuresResponse
            ] = await Promise.all([
                getAllPropertyCities(),
                getAllPropertyTypes(),
                getAllPropertyStatuses(),
                getAllPropertyUnitCategories(),
                getAllPropertyFeatures()
            ]);

            set({
                cities: citiesResponse.data,
                propertyTypes: typesResponse.data,
                propertyStatuses: statusesResponse.data,
                unitCategories: categoriesResponse.data,
                features: featuresResponse.data,
                lastFetched: now,
                isLoading: false
            });
        } catch (error) {
            set({
                error: "Failed to fetch static data",
                isLoading: false
            });
            console.error("Error fetching static data:", error);
        }
    }
}));

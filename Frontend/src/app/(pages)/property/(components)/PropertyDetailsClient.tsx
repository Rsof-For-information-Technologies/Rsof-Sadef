"use client";

import { useEffect } from "react";
import CollapsibleSection from "../../(components)/CollapsibleSection";
import InfoCard from "../../(components)/InfoCard";
import { useStaticDataStore } from "@/store/static-data.store";
import { CreatePropertyData } from "@/types/property";
import Image from "next/image";

interface PropertyDetailsClientProps {
    propertyData: CreatePropertyData;
    baseUrl: string;
}

export default function PropertyDetailsClient({ propertyData, baseUrl }: PropertyDetailsClientProps) {
    const {
        propertyTypes,
        propertyStatuses,
        unitCategories,
        features,
        fetchStaticData,
        isLoading: isLoadingStaticData
    } = useStaticDataStore();

    // Fetch static data when the component mounts
    useEffect(() => {
        fetchStaticData();
    }, [fetchStaticData]);

    // Convert the store data to the format expected by the components
    const propertyTypeOptions = propertyTypes.map(type => ({
        label: type.displayName,
        value: type.value
    }));

    const unitCategoryOptions = unitCategories.map(category => ({
        label: category.displayName,
        value: category.value
    }));

    const featureOptions = features.map(feature => ({
        label: feature.displayName,
        value: feature.value
    }));

    const propertyStatusOptions = propertyStatuses.map(status => ({
        label: status.displayName,
        value: status.value
    }));

    // If still loading static data, show a loading indicator
    if (isLoadingStaticData) {
        return (
            <div className="flex justify-center items-center min-h-[100px] my-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-600">Loading property details...</span>
            </div>
        );
    }

    const data = propertyData;

    return (
        <div className="max-w-[900px] w-full mx-auto">
            <CollapsibleSection title="Basic Information" defaultOpen>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard icon="🏷️" label="Title" value={data.title} color="green" />
                    <InfoCard
                        icon="🏠"
                        label="Type"
                        value={getOptionLabel(data.propertyType, propertyTypeOptions)}
                        color="green"
                    />
                    <InfoCard
                        icon="🏢"
                        label="Unit Category"
                        value={getOptionLabel(data.unitCategory, unitCategoryOptions)}
                        color="green"
                    />
                    <InfoCard icon="🏙️" label="City" value={data.city} color="green" />
                    <InfoCard icon="📍" label="Location" value={data.location} color="green" />
                    <InfoCard icon="📏" label="Area Size" value={data.areaSize} color="green" />
                    <InfoCard
                        icon="📄"
                        label="Status"
                        value={getOptionLabel(data.status, propertyStatusOptions)}
                        color="green"
                    />
                    <InfoCard icon="💼" label="Investor Only" value={data.isInvestorOnly ? "Yes" : "No"} color="green" />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Financial & Dates">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard icon="💰" label="Price" value={data.price} color="orange" />
                    <InfoCard icon="📈" label="Projected Resale Value" value={data.projectedResaleValue} color="orange" />
                    <InfoCard icon="🏦" label="Expected Annual Rent" value={data.expectedAnnualRent} color="orange" />
                    <InfoCard icon="🛡️" label="Warranty Info" value={data.warrantyInfo} color="orange" />
                    <InfoCard icon="📅" label="Expected Delivery Date" value={data.expectedDeliveryDate} color="orange" />
                    <InfoCard icon="⏳" label="Expiry Date" value={data.expiryDate} color="orange" />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Unit Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard icon="🏷️" label="Unit Name" value={data.unitName} color="purple" />
                    <InfoCard icon="🛏️" label="Bedrooms" value={data.bedrooms} color="purple" />
                    <InfoCard icon="🛁" label="Bathrooms" value={data.bathrooms} color="purple" />
                    <InfoCard icon="🏢" label="Total Floors" value={data.totalFloors} color="purple" />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Location & Contact">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard icon="🌐" label="Latitude" value={data.latitude} color="cyan" />
                    <InfoCard icon="🌐" label="Longitude" value={data.longitude} color="cyan" />
                    <InfoCard icon="📱" label="WhatsApp Number" value={data.whatsAppNumber} color="cyan" />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Features">
                <div className="flex flex-wrap gap-2">
                    {Array.isArray(data.features) && data.features.length > 0 ? (
                        data.features.map((feature: string | number, idx: number) => {
                            const label = getOptionLabel(feature, featureOptions);
                            return (
                                <span
                                    key={idx}
                                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {label}
                                </span>
                            );
                        })
                    ) : (
                        <span className="text-gray-400">No features listed.</span>
                    )}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Description">
                <div
                    dangerouslySetInnerHTML={{
                        __html: data.description || "<span class='text-gray-400'>No description provided.</span>",
                    }}
                    className="prose max-w-none text-gray-700"
                ></div>
            </CollapsibleSection>

            <CollapsibleSection title="Images & Videos">
                <div className="flex flex-col gap-6 items-start">
                    {data.imageUrls && data.imageUrls.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                            {data.imageUrls.map((imgSrc: File, idx: number) => (
                                <Image
                                    width={256}
                                    height={192}
                                    key={idx}
                                    src={`${baseUrl}/${imgSrc}`}
                                    alt={`Property Preview ${idx + 1}`}
                                    className="rounded-lg shadow-md w-full md:w-64 h-48 object-cover border border-gray-200"
                                />
                            ))}
                        </div>
                    )}
                    {Array.isArray(data?.videoUrls) && data.videoUrls.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                            {data.videoUrls.map((video: File, idx: number) => (
                                <video
                                    key={idx}
                                    src={`${baseUrl}/${video}`}
                                    controls
                                    className="rounded-lg shadow-md w-full md:w-64 h-48 object-cover border border-gray-200 mb-4"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </CollapsibleSection>
        </div>
    );
}

// Utility function to get display names from options array
function getOptionLabel(
    value: number | string | undefined,
    options: Array<{ label: string; value: number | string }>
) {
    if (value === undefined || value === null) {
        return "N/A";
    }

    const found = options.find((opt) => String(opt.value) === String(value));
    return found ? found.label.replace(/([A-Z])/g, " $1").trim() : String(value);
}

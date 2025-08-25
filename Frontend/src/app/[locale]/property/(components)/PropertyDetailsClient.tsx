"use client";

import { useEffect } from "react";
import CollapsibleSection from "../../(components)/CollapsibleSection";
import InfoCard from "../../(components)/InfoCard";
import { useStaticDataStore } from "@/store/static-data.store";
import { CreatePropertyData } from "@/types/property";
import Image from "next/image";
import { useTranslations } from "next-intl";
interface PropertyDetailsClientProps {
    propertyData: CreatePropertyData;
    baseUrl: string;
}

export default function PropertyDetailsClient({ propertyData, baseUrl }: PropertyDetailsClientProps) {
    const t = useTranslations('PropertyPages.propertyDetailPage');
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
    // if (isLoadingStaticData) {
    //     return (
    //         <div className="flex justify-center items-center min-h-[100px] my-4">
    //             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    //             <span className="ml-3 text-gray-600">{t('loading')}</span>
    //         </div>
    //     );
    // }

    const data = propertyData;

    return (
        <div className="w-full mx-auto">
            <CollapsibleSection title={t('propertyDetails.basicInformationCard.title')} defaultOpen>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard icon="🏷️" label={t('propertyDetails.basicInformationCard.infoCard.title')} value={data.title} color="green" />
                    <InfoCard
                        icon="🏠"
                        label={t('propertyDetails.basicInformationCard.infoCard.type')}
                        value={getOptionLabel(data.propertyType, propertyTypeOptions)}
                        color="green"
                    />
                    <InfoCard
                        icon="🏢"
                        label={t('propertyDetails.basicInformationCard.infoCard.unitCategory')}
                        value={getOptionLabel(data.unitCategory, unitCategoryOptions)}
                        color="green"
                    />
                    <InfoCard icon="🏙️" label={t('propertyDetails.basicInformationCard.infoCard.city')} value={data.city} color="green" />
                    <InfoCard icon="📍" label={t('propertyDetails.basicInformationCard.infoCard.location')} value={data.location} color="green" />
                    <InfoCard icon="📏" label={t('propertyDetails.basicInformationCard.infoCard.areaSize')} value={data.areaSize} color="green" />
                    <InfoCard
                        icon="📄"
                        label={t('propertyDetails.basicInformationCard.infoCard.status')}
                        value={getOptionLabel(data.status, propertyStatusOptions)}
                        color="green"
                    />
                    <InfoCard icon="💼" label={t('propertyDetails.basicInformationCard.infoCard.investorOnly')} value={data.isInvestorOnly ? "Yes" : "No"} color="green" />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title={t('propertyDetails.financialInformationCard.title')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard icon="💰" label={t('propertyDetails.financialInformationCard.infoCard.price')} value={data.price} color="orange" />
                    <InfoCard icon="📈" label={t('propertyDetails.financialInformationCard.infoCard.projectedResaleValue')} value={data.projectedResaleValue} color="orange" />
                    <InfoCard icon="🏦" label={t('propertyDetails.financialInformationCard.infoCard.expectedAnnualRent')} value={data.expectedAnnualRent} color="orange" />
                    <InfoCard icon="🛡️" label={t('propertyDetails.financialInformationCard.infoCard.warrantyInfo')} value={data.warrantyInfo} color="orange" />
                    <InfoCard icon="📅" label={t('propertyDetails.financialInformationCard.infoCard.expectedDeliveryDate')} value={data.expectedDeliveryDate} color="orange" />
                    <InfoCard icon="⏳" label={t('propertyDetails.financialInformationCard.infoCard.expiryDate')} value={data.expiryDate} color="orange" />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title={t('propertyDetails.unitDetailsCard.title')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard icon="🏷️" label={t('propertyDetails.unitDetailsCard.infoCard.unitName')} value={data.unitName} color="purple" />
                    <InfoCard icon="🛏️" label={t('propertyDetails.unitDetailsCard.infoCard.bedrooms')} value={data.bedrooms} color="purple" />
                    <InfoCard icon="🛁" label={t('propertyDetails.unitDetailsCard.infoCard.bathrooms')} value={data.bathrooms} color="purple" />
                    <InfoCard icon="🏢" label={t('propertyDetails.unitDetailsCard.infoCard.totalFloors')} value={data.totalFloors} color="purple" />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title={t('propertyDetails.locationContactCard.title')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard icon="🌐" label={t('propertyDetails.locationContactCard.infoCard.latitude')} value={data.latitude} color="cyan" />
                    <InfoCard icon="🌐" label={t('propertyDetails.locationContactCard.infoCard.longitude')} value={data.longitude} color="cyan" />
                    <InfoCard icon="📱" label={t('propertyDetails.locationContactCard.infoCard.whatsAppNumber')} value={data.whatsAppNumber} color="cyan" />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title={t('propertyDetails.featuresCard.title')}>
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
                        <span className="text-gray-400">{t('propertyDetails.featuresCard.noFeatures')}</span>
                    )}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title={t('propertyDetails.descriptionCard.title')}>
                <div
                    dangerouslySetInnerHTML={{
                        __html: data.description || "<span class='text-gray-400'>No description provided.</span>",
                    }}
                    className="prose max-w-none text-gray-700"
                ></div>
            </CollapsibleSection>

            <CollapsibleSection title={t('propertyDetails.imagesVideosCard.title')}>
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

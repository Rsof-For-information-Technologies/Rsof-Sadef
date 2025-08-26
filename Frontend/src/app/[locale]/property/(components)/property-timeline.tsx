"use client";

import { useEffect, useState } from "react";
import { getPropertyTimeline } from "@/utils/api";
import { PropertyTimelineItem } from "@/types/propertyTimeline";
import { useTranslations } from "next-intl";
import CollapsibleSection from "../../(components)/CollapsibleSection";

interface PropertyTimelineProps {
    propertyId: string | number;
}

export default function PropertyTimeline({ propertyId }: PropertyTimelineProps) {
    const t = useTranslations('PropertyPages.propertyDetailPage');
    const [timelineData, setTimelineData] = useState<PropertyTimelineItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await getPropertyTimeline(propertyId);
                if (response.succeeded && response.data) {
                    setTimelineData(response.data);
                } else {
                    setError(response.message || 'Failed to load timeline data');
                }
            } catch (err) {
                console.error('Error fetching property timeline:', err);
                setError('Failed to load timeline data');
            } finally {
                setIsLoading(false);
            }
        };

        if (propertyId) {
            fetchTimeline();
        }
    }, [propertyId]);

    const formatTimestamp = (timestamp: string) => {
        if (!timestamp || timestamp === "0001-01-01T00:00:00") {
            return "N/A";
        }
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString('en-PK', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return "Invalid Date";
        }
    };

    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'draft':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    if (isLoading) {
        return (
            <CollapsibleSection title={t('propertyDetails.timelineCard.title')} defaultOpen>
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <span className="ml-3 text-gray-600">{t('loading')}</span>
                </div>
            </CollapsibleSection>
        );
    }

    if (error) {
        return (
            <CollapsibleSection title={t('propertyDetails.timelineCard.title')} defaultOpen>
                <div className="flex justify-center items-center py-8">
                    <div className="text-center">
                        <div className="text-red-500 text-lg mb-2">⚠️</div>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            </CollapsibleSection>
        );
    }

    if (!timelineData || timelineData.length === 0) {
        return (
            <CollapsibleSection title={t('propertyDetails.timelineCard.title')} defaultOpen>
                <div className="flex justify-center items-center py-8">
                    <div className="text-center">
                        <div className="text-gray-400 text-lg mb-2">📋</div>
                        <p className="text-gray-500">{t('propertyDetails.timelineCard.noTimeline')}</p>
                    </div>
                </div>
            </CollapsibleSection>
        );
    }

    return (
        <CollapsibleSection title={t('propertyDetails.timelineCard.title')} defaultOpen>
            <div className="space-y-6">
                {timelineData.map((item, index) => (
                    <div key={item.id} className="relative">
                        {/* Timeline line */}
                        {index < timelineData.length - 1 && (
                            <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-300"></div>
                        )}

                        <div className="flex items-start gap-4">
                            {/* Timeline dot */}
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {index + 1}
                                </div>
                            </div>

                            {/* Timeline content */}
                            <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {formatTimestamp(item.timestamp)}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                            {item.actionTaken}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {t('propertyDetails.timelineCard.actionTakenBy')}: {item.actionTakenBy}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </CollapsibleSection>
    );
}
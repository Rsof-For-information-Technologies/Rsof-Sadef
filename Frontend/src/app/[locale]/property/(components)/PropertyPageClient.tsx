'use client';

import { getPropertyColumns } from "@/app/shared/ecommerce/order/order-list/columns";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import { GetProperties, PropertyFilters, PropertyItem } from "@/types/property";
import { getAllProperties, getFilteredProperties } from "@/utils/api";
import PropertyFiltersComponent from "./PropertyFilters";
import TableSkeleton from "./TableSkeleton";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
interface PropertyPageClientProps {
    initialProperties: PropertyItem[];
}

export default function PropertyPageClient({ initialProperties }: PropertyPageClientProps) {
    const t = useTranslations('PropertyPages.propertyListPage.propertyTable');
    const [properties, setProperties] = useState<GetProperties | null>(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<PropertyFilters>({
        pageNumber: 1,
        pageSize: 10
    });

    useEffect(() => {
        if (initialProperties.length > 0) {
            setProperties({
                succeeded: true,
                message: null,
                validationResultModel: null,
                data: { items: initialProperties },
                totalCount: initialProperties.length,
                pageNumber: 1,
                pageSize: 10,
                extra: null,
            });
        }
    }, [initialProperties]);

    const fetchProperties = async (filterParams?: PropertyFilters) => {
        setLoading(true);
        try {
            const params = filterParams || filters;
            const hasFilters = params.city || params.location || params.status !== undefined || params.propertyType !== undefined;
            if (hasFilters) {
                const response = await getFilteredProperties(params);
                setProperties(response);
            } else {
                const response = await getAllProperties(params.pageNumber, params.pageSize);
                setProperties(response);
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
            setProperties({ succeeded: false } as GetProperties);
        } finally {
            setLoading(false);
        }
    };

    const handleFiltersChange = (newFilters: PropertyFilters) => {
        setFilters(newFilters);
    };

    const handleApplyFilters = () => {
        fetchProperties(filters);
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            pageNumber: 1,
            pageSize: 10
        };
        setFilters(clearedFilters);
        fetchProperties(clearedFilters);
    };

    const activeProperties = properties?.data?.items?.filter((item) => item.isActive) || initialProperties;

    return (
        <>
            <PropertyFiltersComponent
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
            />

            {loading ? (
                <TableSkeleton />
            ) : (
                <BasicTableWidget
                    title={t('title')}
                    variant="minimal"
                    data={activeProperties}
                    // @ts-ignore
                    getColumns={getPropertyColumns}
                    enablePagination
                    searchPlaceholder={t('searchPlaceholder')}
                    className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
                />
            )}
        </>
    );
}

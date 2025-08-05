'use client';

import { Button, Input, Select } from "rizzui";
import { PropertyFilters } from "@/types/property";
import { propertyStatusesFilters, propertyTypesFilters } from "@/constants/constants";

interface PropertyFiltersProps {
    filters: PropertyFilters;
    onFiltersChange: (filters: PropertyFilters) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
}

export default function PropertyFiltersComponent({
    filters,
    onFiltersChange,
    onApplyFilters,
    onClearFilters
}: PropertyFiltersProps) {

    const handleFilterChange = (key: keyof PropertyFilters, value: string | number | undefined) => {
        const newFilters = {
            ...filters,
            [key]: value === '' ? undefined : value,
            pageNumber: 1 // Reset to first page when filters change
        };
        onFiltersChange(newFilters);
    };

    return (
        <div className="mb-6 p-4 bg-white dark:bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-200">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Filter Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">City</label>
                    <Input
                        placeholder="Enter city"
                        value={filters.city || ''}
                        onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">Location</label>
                    <Input
                        placeholder="Enter location"
                        value={filters.location || ''}
                        onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">Status</label>
                    <Select
                        options={propertyStatusesFilters}
                        value={filters.status !== undefined ? filters.status.toString() : ''}
                        onChange={(value) => handleFilterChange('status', value && value !== '' ? Number(value) : undefined)}
                        getOptionValue={(option) => option.value.toString()}
                        displayValue={(selected: string) => {
                            if (selected === '') return '';
                            const status = propertyStatusesFilters.find(s => s.value === selected);
                            return status ? status.label : '';
                        }}
                        placeholder="Select status"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">Property Type</label>
                    <Select
                        options={propertyTypesFilters}
                        value={filters.propertyType !== undefined ? filters.propertyType.toString() : ''}
                        onChange={(value) => handleFilterChange('propertyType', value && value !== '' ? Number(value) : undefined)}
                        getOptionValue={(option) => option.value.toString()}
                        displayValue={(selected: string) => {
                            if (selected === '') return '';
                            const type = propertyTypesFilters.find(t => t.value === selected);
                            return type ? type.label : '';
                        }}
                        placeholder="Select property type"
                    />
                </div>
            </div>
            <div className="flex gap-3 mt-4">
                <Button
                    variant="solid"
                    onClick={onApplyFilters}
                >
                    Apply Filter
                </Button>
                <Button
                    variant="outline"
                    onClick={onClearFilters}
                    className="border-gray-300 dark:border-gray-200 text-gray-700 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-100"
                >
                    Clear All Filter
                </Button>
            </div>
        </div>
    );
}

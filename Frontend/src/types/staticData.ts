export interface PropertyEnumItem {
    value: number;
    name: string;
    displayName: string;
}

export interface PropertyEnumResponse<T> {
    succeeded: boolean;
    message: string;
    validationResultModel: null;
    data: T[];
}

// Property Status Types
export type PropertyStatusItem = PropertyEnumItem;
export type GetPropertyStatuses = PropertyEnumResponse<PropertyStatusItem>;

// Property Type Types
export type PropertyTypeItem = PropertyEnumItem;
export type GetPropertyTypes = PropertyEnumResponse<PropertyTypeItem>;

// Property Unit Category Types
export type PropertyUnitCategoryItem = PropertyEnumItem;
export type GetPropertyUnitCategories = PropertyEnumResponse<PropertyUnitCategoryItem>;

// Property Feature Types
export type PropertyFeatureItem = PropertyEnumItem;
export type GetPropertyFeatures = PropertyEnumResponse<PropertyFeatureItem>;

// Property Feature Types
export type PropertyCityItem = PropertyEnumItem;
export type GetPropertyCities = PropertyEnumResponse<PropertyCityItem>;

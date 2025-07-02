export interface PropertyFormData {
    // Basic Info
    title: string;
    propertyType?: number;
    unitCategory?: number;
    price: number;
    city: string;
    location: string;
    areaSize: number;
    bedrooms?: number;
    bathrooms?: number;
    totalFloors?: number;
    unitName?: string;
    isInvestorOnly?: boolean;

    // Property Details
    description: string;
    features?: string[];
    projectedResaleValue?: number;
    expectedAnnualRent?: number;
    warrantyInfo?: string;
    expectedDeliveryDate?: string;
    status?: number;
    expiryDate?: string;

    // Property Media
    images?: File[];
    videos?: File[];

    // Location/Map
    latitude?: number;
    longitude?: number;

    // Contact & Publishing
    whatsAppNumber?: string;
}

export type CreatePropertyData = {
    id: number;
    title: string;
    description: string;
    price: number;
    propertyType?: number;
    unitCategory?: number;
    city: string;
    location: string;
    areaSize: number;
    bedrooms?: number;
    bathrooms?: number;
    totalFloors?: number;
    images?: string[];
    status?: number;
    videos?: string[];
    unitName?: string;
    projectedResaleValue?: number;
    expectedAnnualRent?: number;
    warrantyInfo?: string;
    latitude?: number;
    longitude?: number;
    whatsAppNumber?: string;
    expectedDeliveryDate?: string;
    expiryDate?: string;
    isInvestorOnly?: boolean;
    features?: number[];
    createdAt?: string;
    updatedAt?: string;
    imageBase64Strings?: string[];
    videoBase64Strings?: string[];
}

export type CreatePropertyResponse = {
    data: CreatePropertyData;
    message: string;
    succeeded: boolean;
}

export type PropertyItem = {
    id: number;
    title: string;
    description: string;
    price: number;
    propertyType: number;
    unitCategory: number;
    city: string;
    location: string;
    areaSize: number;
    bedrooms: number;
    bathrooms: number;
    imageBase64Strings: string[];
    status: number;
    expiryDate: string | null;
    isExpired: boolean;
    videoUrls: string[] | null;
    unitName: string;
    projectedResaleValue: number;
    expectedAnnualRent: number;
    warrantyInfo: string;
    latitude: number;
    longitude: number;
    whatsAppNumber: string;
    expectedDeliveryDate: string;
    isInvestorOnly: boolean;
    features: number[];
    isActive: boolean;
}

type PropertyData = {
    items: PropertyItem[];
};

export type GetProperties = {
    succeeded: boolean,
    message: string | null,
    validationResultModel: string | null,
    data: PropertyData,
    totalCount: number,
    pageNumber: number,
    pageSize: number,
    extra: string | null,
}
import axios from 'axios';
import { toast } from 'react-hot-toast';


export interface BlogFormData {
    id?: string | number;
    title: string;
    content: string;
    coverImage?: File | null;
    isPublished: boolean | string;
}

const apiCall = () => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
    });

    instance.interceptors.request.use((config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers["ngrok-skip-browser-warning"] = "true";
        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem("authToken");
                    if (!window.location.pathname.includes("/signin")) {
                        window.location.href = "/signin";
                    }
                }
            } else if (error.response?.status === 403) {
                console.error("Access forbidden. Please check your permissions or authentication.");
                toast.error("Access forbidden. Please check your permissions.");
            }
            return Promise.reject(error);
        }
    );
    return instance;
};

// Blog API functions

type CreateBlogData = {
    content: string;
    coverImage: string | null;
    id: number;
    isPublished: boolean;
    publishedAt: string;
    title: string;
}

 export type CreateBlogResponse = {
    data: CreateBlogData;
    message: string;
    succeeded: boolean;
}

export const createBlog = async (data: BlogFormData)  => {
    const api = apiCall();
    const formData = new FormData();
    formData.append('Title', data.title);
    formData.append('Content', data.content);
    if (data.coverImage) {
        formData.append('CoverImage', data.coverImage);
    }
    formData.append('IsPublished', String(data.isPublished));
    try {
        const response = await api.post<CreateBlogResponse>('/api/v1/blog', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error('Create blog failed:', error);
        throw error;
    }
};

export const updateBlog = async (data: BlogFormData) => {
    const api = apiCall();
    const formData = new FormData();
    if (data.id !== undefined && data.id !== null) {
        formData.append('Id', String(data.id));
    }
    formData.append('Title', data.title);
    formData.append('Content', data.content);
    if (data.coverImage) {
        formData.append('CoverImage', data.coverImage);
    }
    formData.append('IsPublished', String(data.isPublished));
    try {
        const response = await api.put('/api/v1/blog', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error('Update blog failed:', error);
        throw error;
    }
};

export const deleteBlog = async (id: string | number) => {
    const api = apiCall();
    try {
        const response = await api.delete(`/api/v1/blog/${id}`);
        return response.data;
    } catch (error) {
        console.error('Delete blog failed:', error);
        throw error;
    }
};

export const getBlogById = async (id: string | number) => {
    const api = apiCall();
    try {
        const response = await api.get<CreateBlogResponse>(`/api/v1/blog/${id}`);
        return response.data;
    } catch (error) {
        console.error('Get blog by ID failed:', error);
        throw error;
    }
};

// Property API functions
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

type CreatePropertyData = {
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

export const createProperty = async (data: PropertyFormData) => {
    const api = apiCall();
    const formData = new FormData();

    // Basic Info
    formData.append("Title", data.title);
    formData.append("Price", String(data.price));
    formData.append("City", data.city);
    formData.append("Location", data.location);
    formData.append("AreaSize", String(data.areaSize));

    if (data.propertyType !== undefined) formData.append("PropertyType", String(data.propertyType));
    if (data.unitCategory !== undefined) formData.append("UnitCategory", String(data.unitCategory));
    if (data.bedrooms !== undefined) formData.append("Bedrooms", String(data.bedrooms));
    if (data.bathrooms !== undefined) formData.append("Bathrooms", String(data.bathrooms));
    if (data.totalFloors !== undefined) formData.append("floors", String(data.totalFloors));
    if (data.unitName) formData.append("UnitName", data.unitName);
    if (data.isInvestorOnly !== undefined) formData.append("IsInvestorOnly", String(data.isInvestorOnly));

    // Property Details
    formData.append("Description", data.description);
    if (data.features && data.features.length > 0) {
        data.features.forEach((feature) => formData.append("Features", feature));
    }
    if (data.projectedResaleValue !== undefined) formData.append("ProjectedResaleValue", String(data.projectedResaleValue));
    if (data.expectedAnnualRent !== undefined) formData.append("ExpectedAnnualRent", String(data.expectedAnnualRent));
    if (data.warrantyInfo) formData.append("WarrantyInfo", data.warrantyInfo);
    if (data.expectedDeliveryDate) formData.append("ExpectedDeliveryDate", data.expectedDeliveryDate);
    if (data.status !== undefined) formData.append("Status", String(data.status));
    if (data.expiryDate) formData.append("ExpiryDate", data.expiryDate);

    // Property Media
    if (data.images && data.images.length > 0) {
        data.images.forEach((image) => formData.append("Images", image));
    }
    if (data.videos && data.videos.length > 0) {
        data.videos.forEach((video) => formData.append("Videos", video));
    }

    // Location/Map
    if (data.latitude !== undefined) formData.append("Latitude", String(data.latitude));
    if (data.longitude !== undefined) formData.append("Longitude", String(data.longitude));

    // Contact & Publishing
    if (data.whatsAppNumber) formData.append("WhatsAppNumber", data.whatsAppNumber);

    try {
        const response = await api.post<CreatePropertyResponse>("/api/v1/property/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Property created successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Create property failed:", error);
        throw error;
    }
};

export const getPropertyById = async (id: string | number) => {
  const api = apiCall()
  try {
    const response = await api.get<CreatePropertyResponse>(`/api/v1/property/get-by-id?id=${id}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error("Get property by ID failed:", error)
    throw error
  }
}

export const updateProperty = async (id: string | number, data: PropertyFormData) => {
  const api = apiCall()
  const formData = new FormData()

  // Add ID to form data
  formData.append("Id", String(id))

  // Basic Info
  formData.append("Title", data.title)
  formData.append("Price", String(data.price))
  formData.append("City", data.city)
  formData.append("Location", data.location)
  formData.append("AreaSize", String(data.areaSize))

  if (data.propertyType !== undefined) formData.append("PropertyType", String(data.propertyType))
  if (data.unitCategory !== undefined) formData.append("UnitCategory", String(data.unitCategory))
  if (data.bedrooms !== undefined) formData.append("Bedrooms", String(data.bedrooms))
  if (data.bathrooms !== undefined) formData.append("Bathrooms", String(data.bathrooms))
  if (data.totalFloors !== undefined) formData.append("floors", String(data.totalFloors))
  if (data.unitName) formData.append("UnitName", data.unitName)
  if (data.isInvestorOnly !== undefined) formData.append("IsInvestorOnly", String(data.isInvestorOnly))

  // Property Details
  formData.append("Description", data.description)
  if (data.features && data.features.length > 0) {
    data.features.forEach((feature) => formData.append("Features", feature))
  }
  if (data.projectedResaleValue !== undefined)
    formData.append("ProjectedResaleValue", String(data.projectedResaleValue))
  if (data.expectedAnnualRent !== undefined) formData.append("ExpectedAnnualRent", String(data.expectedAnnualRent))
  if (data.warrantyInfo) formData.append("WarrantyInfo", data.warrantyInfo)
  if (data.expectedDeliveryDate) formData.append("ExpectedDeliveryDate", data.expectedDeliveryDate)
  if (data.status !== undefined) formData.append("Status", String(data.status))
  if (data.expiryDate) formData.append("ExpiryDate", data.expiryDate)

  // Property Media
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => formData.append("Images", image))
  }
  if (data.videos && data.videos.length > 0) {
    data.videos.forEach((video) => formData.append("Videos", video))
  }

  // Location/Map
  if (data.latitude !== undefined) formData.append("Latitude", String(data.latitude))
  if (data.longitude !== undefined) formData.append("Longitude", String(data.longitude))

  // Contact & Publishing
  if (data.whatsAppNumber) formData.append("WhatsAppNumber", data.whatsAppNumber)

  try {
    const response = await api.put<CreatePropertyResponse>("/api/v1/property/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    console.log("Property updated successfully:", response.data)
    return response.data
  } catch (error) {
    console.error("Update property failed:", error)
    throw error
  }
}

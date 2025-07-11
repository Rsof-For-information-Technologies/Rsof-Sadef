import { BlogFormData, CreateBlogResponse, GetBlogs } from '@/types/blog';
import { CreateLeadResponse, GetLeads } from '@/types/lead';
import { CreateMaintenanceResponse, GetMaintenanceRequests, MaintenanceRequestFormFormData, MaintenanceRequestItem } from '@/types/maintenanceRequest';
import { PropertyFormData, CreatePropertyResponse, GetProperties } from '@/types/property';
import { MaintenanceRequestForm } from '@/validators/maintenanceRequest';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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

export const getAllBlogs = async (pageNumber = 1, pageSize = 10): Promise<GetBlogs> => {
  const api = apiCall();
  try {
    const {data} = await api.get<GetBlogs>(`/api/v1/blog?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return data;
  } catch (error) {
    console.error('Get all blogs failed:', error);
    throw error;
  }
};

// Maintenance Request API functions

export const createMaintenanceRequest = async (formData: FormData) => {
  const api = apiCall();
  try {
    const response = await api.post('/api/v1/maintenancerequest/create', formData);
    return response.data;
  } catch (error) {
    console.error('Create maintenance request failed:', error);
    throw error;
  }
};

export const updateMaintenanceRequest = async (data: any) => {
    const api = apiCall();
    const formData = new FormData();
    if (data.id !== undefined && data.id !== null) {
        formData.append('Id', String(data.id));
    }
    formData.append('LeadId', data.leadId);
    formData.append('Description', data.description);
    if (data.images && data.images.length > 0) {
        formData.append('Images', data.images[0]);
    }
    if (data.videos && data.videos.length > 0) {
        formData.append('Videos', data.videos[0]);
    }
    try {
        const response = await api.put('/api/v1/maintenancerequest/update', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error('Update maintenance request failed:', error);
        throw error;
    }
};

export const getAllMaintenanceRequests = async (pageNumber = 1, pageSize = 10): Promise<GetMaintenanceRequests> => {
  const api = apiCall();
  try {
    const {data} = await api.get<GetMaintenanceRequests>(`/api/v1/maintenanceRequest?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return data;
  } catch (error) {
    console.error('Get all maintenance requests failed:', error);
    throw error;
  }
};

export const getMaintenanceRequestById = async (id: string | number) => {
    const api = apiCall();
    try {
        const response = await api.get<{ data: MaintenanceRequestItem }>(`/api/v1/maintenancerequest/${id}`);
        return response.data;
    } catch (error) {
        console.error('Get maintenance request by ID failed:', error);
        throw error;
    }
};

export const MaintenanceRequestUpdateStatus = async (id: number, status: number) => {
  const api = apiCall();
  try {
    const response = await api.patch('/api/v1/maintenancerequest/update-status', { id, status, });
    return response.data;
  } catch (error) {
    console.error('Update property status failed:', error);
    throw error;
  }
};

export const deleteMaintenanceRequest = async (id : string | number) => {
  const api = apiCall();
  try {
    const response = await api.delete(`/api/v1/maintenancerequest/delete?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete Maintenance Request failed:', error);
    throw error;
  }
}

// Property API functions

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

export const getAllProperties = async (pageNumber = 1, pageSize = 10): Promise<GetProperties> => {
  const api = apiCall();
  try {
    const {data} = await api.get<GetProperties>(`/api/v1/property/get-all?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return data;
  } catch (error) {
    console.error('Get all properties failed:', error);
    throw error;
  }
};

export const deleteProperty = async (id : string | number) => {
  const api = apiCall();
  try {
    const response = await api.delete(`/api/v1/property/delete?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete property failed:', error);
    throw error;
  }
}

export const PropertyUpdateStatus = async (id: number, status: number) => {
  const api = apiCall();
  try {
    const response = await api.patch('/api/v1/property/update-status', { id, status, });
    return response.data;
  } catch (error) {
    console.error('Update property status failed:', error);
    throw error;
  }
};

export const PropertyExpireDuration = async (id: number, expiryDate: string) => {
  const api = apiCall();
  try {
    const response = await api.patch('/api/v1/property/expire-duration', { id, expiryDate });
    return response.data;
  } catch (error) {
    console.error('Update property expiry duration failed:', error);
    throw error;
  }
};

export const getAllLeads = async (pageNumber = 1, pageSize = 10): Promise<GetLeads> => {
  const api = apiCall();
  try {
    const {data} = await api.get<GetLeads>(`/api/v1/lead?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return data;
  } catch (error) {
    console.error('Get all leads failed:', error);
    throw error;
  }
};

export const getLeadById = async (id: string | number) => {
  const api = apiCall();
  try {
    const response = await api.get<CreateLeadResponse>(`/api/v1/lead/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Get lead by ID failed:", error);
    throw error;
  }
}

export const LeadUpdateStatus = async (id: number, status: number) => {
  const api = apiCall();
  try {
    const response = await api.patch('/api/v1/lead/update-status', { id, status, });
    return response.data;
  } catch (error) {
    console.error('Update lead status failed:', error);
    throw error;
  }
};

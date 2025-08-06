import { BlogFormData, CreateBlogResponse, GetBlogs } from '@/types/blog';
import { CreateLeadResponse, GetLeads } from '@/types/lead';
import { LoginResponse } from '@/types/login';
import { MaintenenceRequestDetail, MaintenenceRequestResponse } from '@/types/maintenanceRequest';
import { PropertyFormData, CreatePropertyResponse, GetProperties, PropertyFilters, GetFilteredProperties } from '@/types/property';
import { UpdatePasswordResponse } from '@/types/updatePassword';
import { GetUsers, GetUserById, UpdateUserRequest, UpdateUserResponse } from '@/types/user';
import { ChangePasswordSchema } from '@/validators/updatePaseword.schema';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { getCookie, removeCookie } from '@/utils/cookieStorage';
import { convertNumberToLocalFormat } from './convertNumberToLocalFormat';

const apiCall = () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
  });

  instance.interceptors.request.use((config) => {
    let token = null;
    if (typeof window !== 'undefined') {
      token = getCookie("access_token");
      if (!token) {
        token = localStorage.getItem("authToken");
      }
    }
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
          localStorage.removeItem("user-info");
          removeCookie("access_token");
          removeCookie("refresh_token");
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/auth/login";
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

export const createBlog = async (data: BlogFormData) => {
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
    const { data } = await api.get<GetBlogs>(`/api/v1/blog?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return data;
  } catch (error) {
    console.error('Get all blogs failed:', error);
    throw error;
  }
};

// Maintenance Request API functions

export const createMaintenanceRequest = async (data: FormData) => {
  const api = apiCall();
  try {
    const response = await api.post<MaintenenceRequestResponse>('/api/v1/maintenancerequest/create', data);
    return response.data;
  } catch (error) {
    console.error('Create maintenance request failed:', error);
    throw error;
  }
};

export const updateMaintenanceRequest = async (id: string | number, data: FormData) => {
  const api = apiCall();
  try {
    data.append("Id", String(id));
    const response = await api.put<MaintenenceRequestResponse>('/api/v1/maintenancerequest/update', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Update maintenance request failed:', error);
    throw error;
  }
};

export const getAllMaintenanceRequests = async (pageNumber = 1, pageSize = 10): Promise<MaintenenceRequestResponse> => {
  const api = apiCall();
  try {
    const { data } = await api.get<MaintenenceRequestResponse>(`/api/v1/maintenanceRequest?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return data;
  } catch (error) {
    console.error('Get all maintenance requests failed:', error);
    throw error;
  }
};

export const getMaintenanceRequestById = async (id: string) => {
  const api = apiCall();
  try {
    const response = await api.get<MaintenenceRequestDetail>(`/api/v1/maintenancerequest/${id}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Get maintenance request failed:', error);
    throw error;
  }
};

export const MaintenanceRequestUpdateStatus = async (id: number, status: number) => {
  const api = apiCall();
  try {
    const response = await api.patch<MaintenenceRequestResponse>('/api/v1/maintenancerequest/update-status', { id, status, });
    return response.data;
  } catch (error) {
    console.error('Update property status failed:', error);
    throw error;
  }
};

export const deleteMaintenanceRequest = async (id: string | number) => {
  const api = apiCall();
  try {
    const response = await api.delete(`/api/v1/maintenancerequest/delete?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete Maintenance Request failed:', error);
    throw error;
  }
}

export const getMaintenanceRequestDashboard = async () => {
  const api = apiCall();
  try {
    const response = await api.get('/api/v1/maintenancerequest/dashboard-stats');
    return response.data;
  } catch (error) {
    console.error('Get maintenance request dashboard failed:', error);
    throw error;
  }
};

export const getPropertyDashboard = async () => {
  const api = apiCall();
  try {
    const response = await api.get('/api/v1/property/dashboard');
    return response.data;
  } catch (error) {
    console.error('Get property dashboard failed:', error);
    throw error;
  }
};

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

  const phoneNumber = convertNumberToLocalFormat(data.whatsAppNumber || "");
  // Contact & Publishing
  if (data.whatsAppNumber) formData.append("WhatsAppNumber", phoneNumber);

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

  const phoneNumber = convertNumberToLocalFormat(data.whatsAppNumber || "");
  // Contact & Publishing
  if (data.whatsAppNumber) formData.append("WhatsAppNumber", phoneNumber)

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
    const { data } = await api.get<GetProperties>(`/api/v1/property/get-all?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return data;
  } catch (error) {
    console.error('Get all properties failed:', error);
    throw error;
  }
};

export const getFilteredProperties = async (filters: PropertyFilters): Promise<GetFilteredProperties> => {
  const api = apiCall();
  try {
    const params = new URLSearchParams();

    if (filters.city) params.append('city', filters.city);
    if (filters.location) params.append('location', filters.location);
    if (filters.status !== undefined) params.append('status', String(filters.status));
    if (filters.propertyType !== undefined) params.append('propertyType', String(filters.propertyType));
    if (filters.pageNumber) params.append('pageNumber', String(filters.pageNumber));
    if (filters.pageSize) params.append('pageSize', String(filters.pageSize));

    const { data } = await api.get<GetFilteredProperties>(`/api/v1/property/filtered?${params.toString()}`);
    return data;
  } catch (error) {
    console.error('Get filtered properties failed:', error);
    throw error;
  }
};

export const deleteProperty = async (id: string | number) => {
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

// Lead API functions

export const getAllLeads = async (pageNumber = 1, pageSize = 10): Promise<GetLeads> => {
  const api = apiCall();
  try {
    const { data } = await api.get<GetLeads>(`/api/v1/lead?pageNumber=${pageNumber}&pageSize=${pageSize}`);
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

export const getLeadDashboard = async () => {
  const api = apiCall();
  try {
    const response = await api.get('/api/v1/lead/dashboard');
    return response.data;
  } catch (error) {
    console.error('Get lead dashboard failed:', error);
    throw error;
  }
};

// Auth API functions

export const UserLoginForm = async (state: {
  email: string;
  password: string
}) => {
  const api = apiCall();
  try {
    const response = await api.post<LoginResponse>('/api/v1/user/login', state);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UserRegisterForm = async (state: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}) => {
  const api = apiCall();

  try {
    const response = await api.post('/api/v1/user/register', state);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UserForgotPasswordForm = async (state: {
  email: string;
  clientUrl: string;
}) => {
  const api = apiCall();

  try {
    const response = await api.post('/api/v1/user/forgot-password', state);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UserResetPasswordForm = async (state: {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  const api = apiCall();

  try {
    const response = await api.post('/api/v1/user/reset-password', state);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UserUpdatePassword = async (data: ChangePasswordSchema): Promise<UpdatePasswordResponse> => {
  const api = apiCall();
  try {
    const response = await api.put<UpdatePasswordResponse>('/api/v1/user/update-password', data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// getAllUsers api

export const getAllUsers = async (pageNumber = 1, pageSize = 10): Promise<GetUsers> => {
  const api = apiCall();
  try {
    const { data } = await api.get<GetUsers>(`/api/v1/user/users?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return data;
  } catch (error) {
    console.error('Get all users failed:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<GetUserById> => {
  const api = apiCall();
  try {
    const { data } = await api.get<GetUserById>(`/api/v1/user/users/${id}`);
    return data;
  } catch (error) {
    console.error('Get user by ID failed:', error);
    throw error;
  }
};

export const updateUser = async (userData: UpdateUserRequest): Promise<UpdateUserResponse> => {
  const api = apiCall();
  try {
    const { data } = await api.put<UpdateUserResponse>('/api/v1/user/update-user', userData);
    return data;
  } catch (error) {
    console.error('Update user failed:', error);
    throw error;
  }
}; 
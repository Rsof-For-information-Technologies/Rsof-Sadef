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

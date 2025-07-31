export interface BlogFormData {
    id?: string | number;
    title: string;
    content: string;
    coverImage?: File | null;
    isPublished: boolean | string;
}

export type CreateBlogData = {
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

export type BlogItem = {
    id: number;
    title: string;
    content: string;
    coverImage: string | null;
    publishedAt: string;
    isPublished: boolean;
}

type BlogData = {
    items: BlogItem[];
};

export type GetBlogs = {
    succeeded: boolean,
    message: string | null,
    validationResultModel: string | null,
    data: BlogData,
    totalCount: number,
    pageNumber: number,
    pageSize: number,
    extra: string | null,
}
export interface MaintenanceRequestFormFormData {
    leadId: string;
    description: string;
    images?: File;
    videos?: File;
}

export type CreateMaintenanceResponse = {
    data: MaintenanceRequestItem;
    message: string;
    succeeded: boolean;
}

export type MaintenanceRequestItem = {
    id: number;
    leadId: number;
    description: string;
    adminResponse: string | null;
    status: number;
    imageBase64Strings: string[] | null;
    videoUrls: string[] | null;
    createdAt: string;
    isActive: boolean;
}

type MaintenanceRequestData = {
    items: MaintenanceRequestItem[];
};

export type GetMaintenanceRequests = {
    succeeded: boolean,
    message: string | null,
    validationResultModel: string | null,
    data: MaintenanceRequestData,
    totalCount: number,
    pageNumber: number,
    pageSize: number,
    extra: string | null,
}
export type DataItem = {
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

export type MaintenenceRequestResponse = {
    data: {
        items: DataItem[];
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        extra: string | null;
    };
    succeeded: boolean;
    message: string;
    validationResultModel: string | null;
};

export type MaintenenceRequestDetail = {
    data: DataItem | null;
    succeeded: boolean;
    message: string;
    validationResultModel: string | null;
};

// Maintenance Request Dashboard Types
export type MaintenanceRequestDashboardData = {
    totalRequests: number;
    requestsThisMonth: number;
    pending: number;
    inProgress: number;
    resolved: number;
    rejected: number;
}

export type MaintenanceRequestDashboardResponse = {
    succeeded: boolean;
    message: string | null;
    validationResultModel: string | null;
    data: MaintenanceRequestDashboardData;
}


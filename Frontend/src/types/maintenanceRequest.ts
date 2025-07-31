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


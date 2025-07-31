export type CreateLeadData = {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    message: string | null;
    propertyId: number | null;
    status: number | null;
}

export type CreateLeadResponse = {
    data: CreateLeadData;
    message: string;
    succeeded: boolean;
}

export type LeadItem = {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    message: string | null;
    propertyId: number | null;
    status: number | null;
}

type LeadData = {
    items: LeadItem[];
};

export type GetLeads = {
    succeeded: boolean,
    message: string | null,
    validationResultModel: string | null,
    data: LeadData,
    totalCount: number,
    pageNumber: number,
    pageSize: number,
    extra: string | null,
}

export type CreateLeadData = {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    message: string | null;
    propertyId: number | null;
    status: string | null;
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
    status: string | null;
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

// Lead Dashboard Types
export type LeadDashboardData = {
    totalLeads: number;
    leadsThisMonth: number;
    activeLeads: number;
    newLeads: number;
    contacted: number;
    inDiscussion: number;
    visitScheduled: number;
    converted: number;
    rejected: number;
}

export type LeadDashboardResponse = {
    succeeded: boolean;
    message: string | null;
    validationResultModel: string | null;
    data: LeadDashboardData;
}

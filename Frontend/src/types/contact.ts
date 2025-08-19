export interface Contact {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    type: string;
    status: string;
    propertyId: number;
    preferredContactMethod: string;
    preferredContactTime: string;
    budget: string;
    propertyType: string;
    location: string;
    isUrgent: boolean;
    createdAt: string;
    updatedAt: string | null;
    propertyTitle: string;
}

export interface GetContacts {
    succeeded: boolean;
    message: string | null;
    validationResultModel: any | null;
    data: {
        items: Contact[];
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        extra: any | null;
    };
}

export interface GetContactById {
    succeeded: boolean;
    message: string | null;
    validationResultModel: any | null;
    data: Contact;
}

export interface UpdateContactStatusResponse {
    succeeded: boolean;
    message: string;
    validationResultModel: any | null;
    data: Contact;
}

export interface ContactDashboardStats {
    totalContacts: number;
    newContacts: number;
    inProgressContacts: number;
    completedContacts: number;
    urgentContacts: number;
    contactsByType: {
        GeneralInquiry: number;
        AgentInquiry: number;
        PriceInquiry: number;
        MaintenanceInquiry: number;
        Complaint: number;
    };
    contactsByStatus: {
        New: number;
        Contacted: number;
        Responded: number;
        Cancelled: number;
        Spam: number;
    };
    recentContacts: Contact[];
}

export interface GetContactDashboardStats {
    succeeded: boolean;
    message: string | null;
    validationResultModel: any | null;
    data: ContactDashboardStats;
}

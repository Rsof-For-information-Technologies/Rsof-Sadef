import { UserRole } from "./userRoles";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    isActive: boolean;
}

export interface GetUsers {
    succeeded: boolean;
    message: string | null;
    validationResultModel: any | null;
    data: User[];
}

export interface GetUserById {
    succeeded: boolean;
    message: string | null;
    validationResultModel: any | null;
    data: User;
}

export interface UpdateUserResponse {
    succeeded: boolean;
    message: string;
    validationResultModel: any | null;
    data: User;
}

export interface UpdateUserRequest {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}
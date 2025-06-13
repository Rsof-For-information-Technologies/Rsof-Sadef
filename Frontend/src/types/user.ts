import { UserRole } from "./userRoles";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    profileImage: string | null;
    createdAt: Date;
    role: UserRole;
}
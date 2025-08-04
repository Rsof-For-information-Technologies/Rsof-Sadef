import { getLocalStorage } from '@/utils/localStorage';
import { User } from '@/types/user';
import { routes } from '@/config/routes';
import { UserRole } from '@/types/userRoles';

export const findFirstAuthorizedUrl = () => {
    const userInfo = getLocalStorage('user-info') as User | null;
    if (!userInfo || !userInfo.role) {
        return routes.auth.login;
    }

    switch (userInfo.role) {
        case UserRole.SuperAdmin:
            return routes.dashboard;

        case UserRole.Admin:
            return routes.blog.list;

        case UserRole.Investor:
            return routes.dashboard;

        case UserRole.Visitor:
            return routes.dashboard;

        default:
            return routes.dashboard;
    }
};
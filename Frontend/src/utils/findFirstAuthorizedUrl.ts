import { getLocalStorage } from '@/utils/localStorage';
import { User } from '@/types/user';
import { routes } from '@/config/routes';
import { UserRole } from '@/types/userRoles';
import { Params } from '@/types/params';

export const findFirstAuthorizedUrl = (locale: Params["locale"]) => {
    const userInfo = getLocalStorage('user-info') as User | null;
    if (!userInfo || !userInfo.role) {
        return `/${locale}${routes.auth.login}`;
    }

    switch (userInfo.role) {
        case UserRole.SuperAdmin:
            return `/${locale}${routes.dashboard}`;

        case UserRole.Admin:
            return `/${locale}${routes.dashboard}`;

        case UserRole.Investor:
            return `/${locale}${routes.dashboard}`;

        case UserRole.Visitor:
            return `/${locale}${routes.dashboard}`;

        default:
            return `/${locale}${routes.dashboard}`;
    }
};
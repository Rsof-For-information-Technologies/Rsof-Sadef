"use client"

import { useIsMounted } from '@/hooks/useIsMounted';
import { useUserStore } from '@/store/user.store';
import { Params } from '@/types/params';
import { User } from '@/types/user';
import { UserRole } from '@/types/userRoles';
import { findFirstAuthorizedUrl } from '@/utils/findFirstAuthorizedUrl';
import { getLocalStorage } from '@/utils/localStorage';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type T_Authorize = {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    navigate?: boolean;
}

const checkAuthorize = (userInfo: User | undefined, allowedRoles: UserRole[]) => {
    if (!userInfo || !userInfo.role) {
        return false;
    }

    return allowedRoles.includes(userInfo.role);
}

function Authorize({ children, allowedRoles, navigate = false }: T_Authorize) {
    const { setUserInfo, userInfo } = useUserStore()
    const [hasAccess, setHasAccess] = useState<boolean>(true);
    const isMounted = useIsMounted()
    const router = useRouter();
    const params = useParams<Params>();

    useEffect(() => {
        if (!userInfo)
            setUserInfo(getLocalStorage("user-info") as User)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (userInfo && Object.entries(userInfo).length > 0 && allowedRoles) {
            setHasAccess(checkAuthorize(userInfo, allowedRoles))
        }
        else if (!userInfo || Object.entries(userInfo || {}).length <= 0) {
            setHasAccess(false)
        }
    }, [userInfo, allowedRoles])

    useEffect(() => {
        if (!hasAccess && userInfo && navigate) {
            const authorizedUrl = findFirstAuthorizedUrl(params.locale);
            router.push(authorizedUrl);
        }
    }, [userInfo, hasAccess, router, navigate, params]);

    if (!isMounted)
        return null;

    if (hasAccess) {
        return (
            <>
                {children}
            </>
        )
    }
    else {
        return null
    }
}

export default Authorize
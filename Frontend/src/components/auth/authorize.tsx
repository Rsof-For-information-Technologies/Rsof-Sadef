"use client"

import { useUserStore } from '@/store/user.store';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useIsMounted } from '@/hooks/use-is-mounted';
import { getLocalStorage } from '@/utils/localStorage';
import { Params } from '@/types/params';
import { User } from '@/types/user';
import { UserRole } from '@/types/userRoles';
import { findFirstAuthorizedUrl } from '@/utils/findFirstAuthorizedUrl';

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
    const [hasAccess, setHasAccess] = useState<boolean>(false);
    const isMounted = useIsMounted()
    const router = useRouter();
    const params = useParams<Params>()

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
        console.log("outside if", { page:window.location.pathname,hasAccess, userInfo, navigate })
        if (hasAccess === false) {
            if(userInfo){
                console.log("inside if", { hasAccess, userInfo, navigate })
                const authorizedUrl = findFirstAuthorizedUrl();
                console.log({authorizedUrl})
                if (navigate) {
                    console.log("Redirecting to authorized URL:", authorizedUrl);
                    router.push(authorizedUrl);
                }
            }
        }else{
            console.log("User has access, no redirection needed.");
        }
    }, [hasAccess, userInfo, router, navigate, params])

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
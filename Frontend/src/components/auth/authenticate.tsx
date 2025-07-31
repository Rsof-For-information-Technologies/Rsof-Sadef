"use client"
import { useUserStore } from '@/store/user.store'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useIsMounted } from '@/hooks/use-is-mounted'
import { routes } from '@/config/routes'
import { getLocalStorage } from '@/utils/localStorage';
import { User } from '@/types/user'

type T_Authenticate = {
    children: React.ReactNode;
    isSidebar?: boolean;
}

function Authenticate({ children, }: T_Authenticate) {
    const { setUserInfo, userInfo } = useUserStore();

    const mounted = useIsMounted();

    const router = useRouter();

    const searchParams = useSearchParams()

    const pathName = usePathname()
    
    console.log("Authenticate Rendered", { userInfo, searchParams, pathName })
    useEffect(() => {
        setUserInfo(getLocalStorage("user-info") as User)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setUserInfo])

    useEffect(() => {
        if (!userInfo && mounted) {
            const queryParams = new URLSearchParams(searchParams.toString());

            queryParams.set("logout", "true")

            queryParams.set("navigate_to", pathName);

            router.push(`/${routes.auth.login}?${queryParams.toString()}`);

        }
    }, [userInfo, router, mounted, pathName, searchParams])


    if (userInfo) return (
        <>
            {children}
        </>
    )

    else
        return null

}

export default Authenticate
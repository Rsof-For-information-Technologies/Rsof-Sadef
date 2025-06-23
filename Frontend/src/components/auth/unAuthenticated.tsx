"use client"
import { useUserStore } from '@/store/user.store'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useIsMounted } from '@/hooks/use-is-mounted'
import { routes } from '@/config/routes';
import { DeleteLocalStorage, getLocalStorage } from '@/utils/localStorage'
import { User } from '@/types/user'

type T_UnAuthenticate = {
    children: React.ReactNode;
    navigate?: boolean;
}

function UnAuthenticated({ children, navigate = false }: T_UnAuthenticate) {
    const { setUserInfo, userInfo } = useUserStore();
    const searchParams = useSearchParams()
    const isMounted = useIsMounted();
    const router = useRouter();

    console.log("UnAuthenticated Rendered", { userInfo, searchParams })

    const logout = searchParams.get("logout")
    useEffect(() => {
        if (isMounted) {
            if (logout === "true") {
                const urlSearchParams = new URLSearchParams(searchParams.toString());

                DeleteLocalStorage("user-info");
                setUserInfo()
                urlSearchParams.delete("logout");
                router.push(`${routes.auth.login}?${urlSearchParams}`)
            }
            else if (getLocalStorage("user-info"))
                setUserInfo(getLocalStorage("user-info") as User)
        }
    }, [logout, setUserInfo, router, searchParams, isMounted])

    useEffect(() => {
        if (isMounted) {
            if (userInfo && navigate)
                router.push("/")
        }
    }, [userInfo, router, navigate, isMounted])

    if (!userInfo) return (
        <>
            {children}
        </>
    )
    else
        return null

}

export default UnAuthenticated
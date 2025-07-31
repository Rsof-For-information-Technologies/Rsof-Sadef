import { routes } from "@/config/routes";
import { Params } from "@/types/params";
import { T_SearchParams } from "@/types/searchParams";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";

export const logoutOnCookieExpire = (error: unknown) => {
    if (error instanceof AxiosError) {
        if (error.status === 401 && error.response?.data.message === "Invalid signature. User logged out." || "Please login again") {
            const queryParams = new URLSearchParams();
            
            queryParams.set("logout", "true")

            redirect(`${routes.auth.login}?${queryParams.toString()}`);
            return false
        }
        return true
    }
    return true
}
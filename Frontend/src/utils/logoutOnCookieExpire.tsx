import { routes } from "@/config/routes";
import { Params } from "@/types/params";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";

export const logoutOnCookieExpire = (error: unknown, params: Params) => {
    if (error instanceof AxiosError) {
        if (error.status === 401 && error.response?.data.message === "Invalid signature. User logged out." || "Please login again") {
            const queryParams = new URLSearchParams();

            queryParams.set("logout", "true")

            redirect(`/${params.locale}${routes.auth.login}?${queryParams.toString()}`);
            return false
        }
        return true
    }
    return true
}
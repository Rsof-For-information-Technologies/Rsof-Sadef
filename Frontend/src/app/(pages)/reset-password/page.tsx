import ResetPasswordForm from "./resetPasswordForm";
import { serverAxiosInstance } from "@/utils/axios.instance";
import { AxiosError } from "axios";
import { T_SearchParams } from "@/types/searchParams";
import { Metadata } from "next";
import TextErrorCard from "../(components)/TextErrorCard";
import { logoutOnCookieExpire } from "@/utils/logoutOnCookieExpire";

type QueryParams = T_SearchParams & {
    token: string
}

type UserEmail = {
    email: string
}

export const metadata: Metadata = {
    title: "Reset Password",
};

const getUserEmail = async (searchParams: QueryParams) => {
    try {
        const { data } = await serverAxiosInstance.get<UserEmail>('/api/user/verify/reset-token?token=' + searchParams.token)
        return { email: data.email }
    } catch (error) {
        const deleted = logoutOnCookieExpire(error)
        if (!deleted)
            return undefined
        console.log('error occurred while fetching user email')
        return { error: error as AxiosError }
    }
}

export default async function Page({ searchParams }: { searchParams: QueryParams; }) {

    const res = await getUserEmail(searchParams);
    if (!res)
        return

    const { email, error } = res
    if (error) {
        if ((error?.response?.status ?? 0) >= 400 && (error?.response?.status ?? 0) < 500) {
            return <TextErrorCard message="Token has expired" />
        }
        if ((error?.response?.status ?? 0) >= 500) {
            return <TextErrorCard message="Internal server error" />
        }
    }
    else {
        return (
            <ResetPasswordForm email={email as string} />
        )
    }

}
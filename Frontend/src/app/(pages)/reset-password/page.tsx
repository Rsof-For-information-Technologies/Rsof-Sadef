import { Suspense } from "react";
import ResetPasswordForm from "./resetPasswordForm";
import { serverAxiosInstance } from "@/utils/axios.instance";
import { AxiosError } from "axios";
import { T_SearchParams } from "@/types/searchParams";
import TextErrorCard from "../(components)/TextErrorCard";
import { Metadata } from "next";
import { logoutOnCookieExpire } from "@/utils/logoutOnCookieExpire";
import { Params } from "@/types/params";

type QueryParams = T_SearchParams & {
    token: string
}

type UserEmail = {
    email: string
}

export const metadata: Metadata = {
    title: "Reset Password",
};

const getUserEmail = async (searchParams: QueryParams, params: Params) => {
    try {
        const { data } = await serverAxiosInstance.get<UserEmail>('/api/user/verify/reset-token?token=' + searchParams.token)
        return { email: data.email }
    } catch (error) {
        const deleted = logoutOnCookieExpire(error, searchParams, params)
        if (!deleted)
            return undefined
        console.log('error occurred while fetching user email')
        return { error: error as AxiosError }
    }
}

export default async function Page({ searchParams, params }: { searchParams: QueryParams; params: Params; }) {

    const res = await getUserEmail(searchParams, params);
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
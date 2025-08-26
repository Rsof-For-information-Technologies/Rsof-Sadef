import AuthWrapper from "@/app/shared/auth-layout/auth-wrapper-four";
import { T_SearchParams } from "@/types/searchParams";
import { serverAxiosInstance } from "@/utils/axios.instance";
import { logoutOnCookieExpire } from "@/utils/logoutOnCookieExpire";
import { AxiosError } from "axios";
import { Metadata } from "next";
import ResetPasswordForm from "./resetPasswordForm";
import { Params } from "@/types/params";
import { getTranslations } from "next-intl/server";

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
        const deleted = logoutOnCookieExpire(error, params)
        if (!deleted)
            return undefined
        console.log('error occurred while fetching user email')
        return { error: error as AxiosError }
    }
}

export default async function Page({
    searchParams,
    params,
}: {
    searchParams: QueryParams;
    params: Params
}) {
    const t = await getTranslations("ResetPasswordPage");
    return (
        <AuthWrapper
            title={
                <>
                    {t('title.line1')} <br /> {t('title.line2')}
                </>
            }
            isSignIn
            isSocialLoginActive={false}
        >
            <div className="mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-xl 2xl:pb-8 2xl:pt-2">
                <ResetPasswordForm email={"email" as string} />
            </div>
        </AuthWrapper>
    )

    // const res = await getUserEmail(searchParams, params);
    // if (!res)
    //     return

    // const { email, error } = res
    // if (error) {
    //     if ((error?.response?.status ?? 0) >= 400 && (error?.response?.status ?? 0) < 500) {
    //         return <TextErrorCard message="Token has expired" />
    //     }
    //     if ((error?.response?.status ?? 0) >= 500) {
    //         return <TextErrorCard message="Internal server error" />
    //     }
    // }
    // else {
    //     return (
    //         <ResetPasswordForm email={email as string} />
    //     )
    // }

}
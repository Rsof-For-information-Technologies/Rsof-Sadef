
import { Metadata } from "next";
import ForgotPasswordForm from "./forgotPasswordForm";
import AuthWrapper from "@/app/shared/auth-layout/auth-wrapper-four";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset your password",
};

export default async function ForgotPassword() {
    const t = await getTranslations("ForgotPasswordPage.title")

    return (
        <AuthWrapper
            title={
                <>
                    {t('line1')} <br className="hidden sm:inline-block" />{' '}
                    {t('line2')}
                </>
            }
        >
            <ForgotPasswordForm />
        </AuthWrapper>
    );
}
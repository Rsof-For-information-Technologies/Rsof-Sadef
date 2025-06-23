
import { Metadata } from "next";
import ForgotPasswordForm from "./forgotPasswordForm";
import AuthWrapper from "@/app/shared/auth-layout/auth-wrapper-four";

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset your password",
};

export default function ForgotPassword() {

    return (
        <AuthWrapper
            title={
                <>
                Having trouble to sign in? <br className="hidden sm:inline-block" />{' '}
                Reset your password.
                </>
            }
        >
            <ForgotPasswordForm />
        </AuthWrapper>
    );
}

import { Metadata } from "next";
import ForgotPasswordForm from "./forgotPasswordForm";



export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset your password",
};

export default function ForgotPassword() {


    return (
        <ForgotPasswordForm />
    );
}
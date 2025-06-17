import React from 'react'
import { Metadata } from 'next'
import LoginForm from './loginForm'
import UnAuthenticated from '@/components/auth/unAuthenticated'
import AuthWrapper from '@/app/shared/auth-layout/auth-wrapper-four';

export const metadata: Metadata = {
    title: "Login",
    description: "Login to access site",
};

async function Login() {
    return (
        <AuthWrapper
            title={
                <>
                    Welcome Back! <br /> Sign in with your credentials.
                </>
            }
            isSignIn
            isSocialLoginActive={false}
        >
        <UnAuthenticated navigate={true}>
                <div className="mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-xl 2xl:pb-8 2xl:pt-2">
                    <LoginForm />
                </div>
        </UnAuthenticated>
        </AuthWrapper>
    )
}

export default Login
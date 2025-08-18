import React from 'react'
import { Metadata } from 'next'
import LoginForm from './loginForm'
import AuthWrapper from '@/app/shared/auth-layout/auth-wrapper-four';
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
    title: "Login",
    description: "Login to access site",
};

async function Login() {
    const t = await getTranslations("SignInPage");
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
                <LoginForm />
            </div>
        </AuthWrapper>
    )
}

export default Login
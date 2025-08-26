import React from 'react'
import { Metadata } from 'next'
import UnAuthenticated from '@/components/auth/unAuthenticated'
import AuthWrapper from '@/app/shared/auth-layout/auth-wrapper-four';
import SignupForm from './signupForm';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: "Signup",
    description: "Signup to access site",
};

async function Signup() {
    const t = await getTranslations("SignUpPage");
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
            {/* <UnAuthenticated navigate={true}> */}
                <div className="mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-xl 2xl:pb-8 2xl:pt-2">
                    <SignupForm/>
                </div>
            {/* </UnAuthenticated> */}
        </AuthWrapper>
    )
}

export default Signup
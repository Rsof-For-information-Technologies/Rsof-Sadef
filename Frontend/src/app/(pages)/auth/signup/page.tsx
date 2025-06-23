import React from 'react'
import { Metadata } from 'next'
import UnAuthenticated from '@/components/auth/unAuthenticated'
import AuthWrapper from '@/app/shared/auth-layout/auth-wrapper-four';
import SignupForm from './signupForm';

export const metadata: Metadata = {
    title: "Signup",
    description: "Signup to access site",
};

async function Signup() {
    return (
        <AuthWrapper
            title="Join us today! Get special benefits and stay up-to-date."
            isSocialLoginActive={false}
        >
            <UnAuthenticated navigate={true}>
                <div className="mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-xl 2xl:pb-8 2xl:pt-2">
                    <SignupForm/>
                </div>
            </UnAuthenticated>
        </AuthWrapper>
    )
}

export default Signup
import React from 'react'
import { Metadata } from 'next'
import LoginForm from './loginForm'
import UnAuthenticated from '@/components/auth/unAuthenticated'

export const metadata: Metadata = {
    title: "Login",
    description: "Login to access site",
};

async function Login() {
    return (
        // <UnAuthenticated navigate={true}>
            <div className="mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-xl 2xl:pb-8 2xl:pt-2">
                <LoginForm />
            </div>
        // </UnAuthenticated>
    )
}

export default Login
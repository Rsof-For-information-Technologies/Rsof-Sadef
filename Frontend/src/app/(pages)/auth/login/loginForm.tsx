"use client"
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PiArrowRightBold } from 'react-icons/pi'
import { Checkbox, Input, Password } from 'rizzui'
import { zodResolver } from "@hookform/resolvers/zod";
import useMedia from 'react-use/lib/useMedia'
import { useRouter, useSearchParams } from 'next/navigation'
import { routes } from '@/config/routes'
import { removeLocalStorage, setLocalStorage } from '@/utils/localStorage'
import { FormStatusButton } from '@/components/formStatusButton'
import { Login, login } from '@/validators/login.validator'
import Link from 'next/link'
import { UserLoginForm } from '@/utils/api'
import { setCookie } from '@/utils/cookieStorage'

const initialValues = {
    email: "",
    password: "",
    rememberMe: true,
}

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const [serverError, setServerError] = useState<string | null>(null);
    const isMedium = useMedia('(max-width: 1200px)', false);

    const { register, handleSubmit, formState: { errors }, setError, } = useForm<Login>({
        resolver: zodResolver(login),
        defaultValues: { ...initialValues }
    })

    const onSubmit = async (state: Login) => {
        try {
            const response = await UserLoginForm(state);
            console.log({ response });

            if (response.succeeded) {
                setLocalStorage("user-info",{
                    id: response.data.id,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    role: response.data.role,
                });
                setCookie("access_token",response.data.token)
                setCookie("refresh_token",response.data.refreshToken)
                router.push(`/`);
            } else {
                setServerError(response.message);
            }

        } catch (error) {
            console.log(error);
            if ((error as any).response?.data && Object.entries((error as any).response?.data).length) {
                for (let [key, value] of Object.entries((error as any).response?.data)) {
                    setError(key as any, { type: 'custom', message: value as string });
                }
            }
        }
    };

    const logout = searchParams.get("logout")
    useEffect(() => {

        if (logout === "true") {
            const urlSearchParams = new URLSearchParams(searchParams.toString());
            removeLocalStorage("user-info");
            // setUserInfo()
            urlSearchParams.delete("logout");
            router.push(`/${routes.auth.login}?${urlSearchParams}`)
        }
    }, [logout, router, searchParams])

    return (
        <form action={() => handleSubmit(onSubmit)()}>
            <div className="space-y-5">
                <Input
                    type="email"
                    size="lg"
                    label="Email"
                    id='email'
                    placeholder="Enter your email"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.email?.message}
                    {...register('email')}
                />
                <Password
                    label="Password"
                    id='password'
                    placeholder="Enter your password"
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.password?.message}
                    {...register('password')}
                />
                <p className='text-red-500 text-sm'>{(errors as any)?.message?.message}</p>
                <div className="flex items-center justify-between pb-2">
                    <Checkbox
                        {...register('rememberMe')}
                        label="Remember Me"
                        className="[&>label>span]:font-medium"
                    />
                    <Link
                        href={`${routes.auth.forgotPassword}`}
                        className="h-auto p-0 text-sm font-semibold text-gray-700 underline transition-colors hover:text-primary hover:no-underline"
                    >
                        Forgot Password
                    </Link>
                </div>
                {serverError && (
                    <div className="border border-red-300 p-3 rounded-md bg-red-50 dark:bg-red-100/10">
                        <p className="text-red-600 text-sm font-medium">{serverError}</p>
                    </div>
                )}

                <FormStatusButton
                    className="w-full @xl:w-full dark:bg-[#090909] dark:text-white hover:dark:bg-black"
                    type="submit"
                    size={isMedium ? 'lg' : 'lg'}>
                    <span>Login</span>
                    <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
                </FormStatusButton>
            </div>
        </form>
    )
}

export default LoginForm
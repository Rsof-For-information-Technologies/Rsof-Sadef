"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { PiArrowRightBold } from 'react-icons/pi'
import { Input, Password } from 'rizzui'
import { zodResolver } from "@hookform/resolvers/zod";
import useMedia from 'react-use/lib/useMedia'
import { useRouter, useSearchParams } from 'next/navigation'
import { routes } from '@/config/routes'
import { clientAxiosInstance } from '@/utils/axios.instance'
import { DeleteLocalStorage, setLocalStorage } from '@/utils/localStorage'
import { FormStatusButton } from '@/components/formStatusButton'
import { Login, login } from '@/validators/login.validator'

const initialValues = {
    email: "",
    password: "",
    rememberMe: true,
}

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const isMedium = useMedia('(max-width: 1200px)', false);
    const { register, handleSubmit, formState: { errors }, setError, } = useForm<Login>({
        resolver: zodResolver(login),
        defaultValues: { ...initialValues }
    })

    const onSubmit = async (state: Login) => {

        try {
            const { data } = await clientAxiosInstance.post('/api/login', state);

            setLocalStorage("user-info", data);

            if (searchParams.get("navigate_to"))
                router.push(`${searchParams.get("navigate_to")}`)

            else {
                router.push(`/`)
            }

        } catch (error) {
            console.log(error)
            if ((error as any).response?.data && Object.entries((error as any).response?.data).length) {
                for (let [key, value] of Object.entries((error as any).response?.data)) {
                    setError(key as any, { type: 'custom', message: value as string })
                }
            }
        }
    };
    const logout = searchParams.get("logout")
    useEffect(() => {

        if (logout === "true") {
            const urlSearchParams = new URLSearchParams(searchParams.toString());

            DeleteLocalStorage("user-info");
            // setUserInfo()

            urlSearchParams.delete("logout");
            router.push(`/${routes.login}?${urlSearchParams}`)
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
                {/* <div className="flex items-center justify-between pb-2">
                    <Link
                        href={`/${params.locale}${routes.forgotPassword}`}
                        className="h-auto p-0 text-sm font-semibold text-gray-700 underline transition-colors hover:text-primary hover:no-underline"
                    >
                        {t("forgotPassword")}
                    </Link>
                </div> */}
                <FormStatusButton
                    className="w-full @xl:w-full bg-[#4675db] hover:bg-[#1d58d8] dark:hover:bg-[#1d58d8] dark:text-white"
                    type="submit"
                    size={isMedium ? 'lg' : 'xl'}>
                    <span>Login</span>
                    <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
                </FormStatusButton>
            </div>
        </form>
    )
}

export default LoginForm
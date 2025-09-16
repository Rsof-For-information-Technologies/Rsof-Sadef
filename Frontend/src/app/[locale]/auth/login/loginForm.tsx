"use client"
import { FormStatusButton } from '@/components/formStatusButton'
import { routes } from '@/config/routes'
import { Params } from '@/types/params'
import { UserLoginForm } from '@/utils/api'
import { setCookie } from '@/utils/cookieStorage'
import { removeLocalStorage, setLocalStorage } from '@/utils/localStorage'
import { Login, login } from '@/validators/login.validator'
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PiArrowRightBold } from 'react-icons/pi'
import useMedia from 'react-use/lib/useMedia'
import { Checkbox, Input, Password } from 'rizzui'
import cn from '@/utils/class-names'

const initialValues = {
    email: "",
    password: "",
    rememberMe: true,
}

function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams<Params>()
    const [serverError, setServerError] = useState<string | null>(null);
    const isMedium = useMedia('(max-width: 1200px)', false);
    const t = useTranslations("SignInPage.form");

    const { register, handleSubmit, formState: { errors }, setError, } = useForm<Login>({
        resolver: zodResolver(login),
        defaultValues: { ...initialValues }
    })

    const onSubmit = async (state: Login) => {
        try {
            const response = await UserLoginForm(state);
            if (response.succeeded) {
                setLocalStorage("user-info", {
                    id: response.data.id,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    role: response.data.role,
                });
                setCookie("access_token", response.data.token)
                setCookie("refresh_token", response.data.refreshToken)

                if (searchParams.get("navigate_to"))
                    router.push(`${searchParams.get("navigate_to")}`)
                else {
                    router.push(`/${params.locale}${routes.dashboard}`)
                }

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
            router.push(`/${params.locale}${routes.auth.login}?${urlSearchParams}`)
        }
    }, [logout, router, params.locale, searchParams])

    return (
        <form action={() => handleSubmit(onSubmit)()}>
            <div className="space-y-5">
                <Input
                    type="email"
                    size="lg"
                    label={t('email')}
                    id='email'
                    placeholder={t('emailPlaceholder')}
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.email?.message}
                    {...register('email')}
                />
                <Password
                    label={t('password')}
                    id='password'
                    placeholder={t('passwordPlaceholder')}
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
                        label={t('rememberMe')}
                        className="[&>label>span]:font-medium"
                    />
                    <Link
                        href={`/${params.locale}${routes.auth.forgotPassword}`}
                        className="h-auto p-0 text-sm font-semibold text-gray-700 underline transition-colors hover:text-primary hover:no-underline"
                    >
                        {t('forgotPassword')}
                    </Link>
                </div>
                {serverError && (
                    <div className="border border-red-300 p-3 rounded-md bg-red-50 dark:bg-red-100/10">
                        <p className="text-red-600 text-sm font-medium">{serverError}</p>
                    </div>
                )}

                <FormStatusButton
                    className="group w-full @xl:w-full dark:bg-[#090909] dark:text-white hover:dark:bg-black "
                    type="submit"
                    size={isMedium ? 'lg' : 'lg'}>
                    <span>{t('loginBtn')}</span>
                    <PiArrowRightBold className={cn("ms-2 mt-0.5 h-5 w-5", params.locale === 'ar' ? 'rotate-180' : 'rotate-0')} />
                </FormStatusButton>
            </div>
        </form>
    )
}

export default LoginForm

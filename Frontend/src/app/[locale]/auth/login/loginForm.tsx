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
import { useFCM } from '@/hooks/useFCM'

const initialValues = {
    email: "",
    password: "",
    fcmToken: "",
    deviceType: "",
    rememberMe: true,
}

function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams<Params>()
    const [serverError, setServerError] = useState<string | null>(null);
    const isMedium = useMedia('(max-width: 1200px)', false);
    const t = useTranslations("SignInPage.form");
    
    // Use FCM hook
    const { fcmToken, deviceType, isLoading: isLoadingFCM, error: fcmError, refreshToken, hasPermission } = useFCM();

    const { register, handleSubmit, formState: { errors }, setError, setValue, watch } = useForm<Login>({
        resolver: zodResolver(login),
        defaultValues: { ...initialValues }
    })

    // Update form values when FCM data is ready
    useEffect(() => {
        if (fcmToken && deviceType) {
            setValue('fcmToken', fcmToken);
            setValue('deviceType', deviceType);
        }
    }, [fcmToken, deviceType, setValue]);

    // Handle FCM errors
    useEffect(() => {
        if (fcmError) {
            setServerError(fcmError);
        }
    }, [fcmError]);

    const onSubmit = async (state: Login) => {
        try {
            // Clear any previous server errors
            setServerError(null);

            // Ensure we have FCM token and device type
            if (!state.fcmToken) {
                setServerError('FCM token is required. Please enable notifications or refresh the page.');
                return;
            }
            
            if (!state.deviceType) {
                setServerError('Unable to detect device type. Please try again.');
                return;
            }

            console.log('Submitting login with:', {
                email: state.email,
                deviceType: state.deviceType,
                hasToken: !!state.fcmToken
            });

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
                        {fcmError && (
                            <button 
                                type="button"
                                onClick={refreshToken}
                                className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                                Try to fix notification issues
                            </button>
                        )}
                    </div>
                )}

                {/* FCM Status Indicator */}
                {!isLoadingFCM && (
                    <div className={`border p-3 rounded-md text-sm ${
                        fcmToken 
                            ? 'border-green-300 bg-green-50 text-green-700' 
                            : 'border-yellow-300 bg-yellow-50 text-yellow-700'
                    }`}>
                        {fcmToken ? (
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Notifications enabled
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                Notifications required for login
                                <button 
                                    type="button"
                                    onClick={refreshToken}
                                    className="ml-auto text-xs bg-yellow-100 hover:bg-yellow-200 px-2 py-1 rounded"
                                >
                                    Enable
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Debug info in development */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="border border-blue-300 p-3 rounded-md bg-blue-50 dark:bg-blue-100/10">
                        <p className="text-blue-600 text-xs">
                            Device: {watch('deviceType')} | FCM: {watch('fcmToken') ? 'Ready' : 'Loading...'}
                            <br />
                            Permission: {hasPermission ? 'Granted' : 'Not granted'}
                        </p>
                    </div>
                )}

                <FormStatusButton
                    className="group w-full @xl:w-full dark:bg-[#090909] dark:text-white hover:dark:bg-black "
                    type="submit"
                    size={isMedium ? 'lg' : 'lg'}
                    disabled={isLoadingFCM}>
                    <span>{isLoadingFCM ? 'Initializing...' : t('loginBtn')}</span>
                    <PiArrowRightBold className={cn("ms-2 mt-0.5 h-5 w-5", params.locale === 'ar' ? 'rotate-180' : 'rotate-0')} />
                </FormStatusButton>
            </div>
        </form>
    )
}

export default LoginForm
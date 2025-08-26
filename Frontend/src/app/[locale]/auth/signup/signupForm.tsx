"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PiArrowRightBold } from "react-icons/pi";
import { Password, Input } from "rizzui";
import { zodResolver } from "@hookform/resolvers/zod";
import useMedia from "react-use/lib/useMedia";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { routes } from "@/config/routes";
import { removeLocalStorage, setLocalStorage } from "@/utils/localStorage";
import { FormStatusButton } from "@/components/formStatusButton";
import { Signup, signup } from "@/validators/signup.validator";
import { UserRegisterForm } from "@/utils/api";
import { Params } from "@/types/params";
import cn from '@/utils/class-names'
import { useTranslations } from 'next-intl'

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
};

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams<Params>();
    const [serverError, setServerError] = useState<string | null>(null);
    const isMedium = useMedia("(max-width: 1200px)", false);
    const t = useTranslations('SignUpPage.form');
    const { register, handleSubmit, formState: { errors }, setError, } = useForm<Signup>({
        resolver: zodResolver(signup),
        defaultValues: { ...initialValues },
    });

    const onSubmit = async (state: Signup) => {
        try {
            const data = await UserRegisterForm(state);
            if (data.succeeded) {
                setLocalStorage("user-info", data);
                router.push(`/${params.locale}${routes.auth.login}`);
            } else {
                setServerError(data.message);
            }

        } catch (error) {
            console.log(error);
            if (
                (error as any).response?.data &&
                Object.entries((error as any).response?.data).length
            ) {
                for (let [key, value] of Object.entries(
                    (error as any).response?.data
                )) {
                    setError(key as any, { type: "custom", message: value as string });
                }
            }
        }
    };

    const logout = searchParams.get("logout");
    useEffect(() => {
        if (logout === "true") {
            const urlSearchParams = new URLSearchParams(searchParams.toString());
            removeLocalStorage("user-info");
            urlSearchParams.delete("logout");
            router.push(`/${params.locale}${routes.auth.signup}?${urlSearchParams}`);
        }
    }, [logout, router, searchParams]);

    return (
        <form action={() => handleSubmit(onSubmit)()}>
            <div className="space-y-5">
                <Input
                    type="text"
                    size="lg"
                    label={t('firstName')}
                    id="firstName"
                    placeholder={t('firstNamePlaceholder')}
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.firstName?.message}
                    {...register("firstName")}
                />
                <Input
                    type="text"
                    size="lg"
                    label={t('lastName')}
                    id="lastName"
                    placeholder={t('lastNamePlaceholder')}
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.lastName?.message}
                    {...register("lastName")}
                />
                <Input
                    type="email"
                    size="lg"
                    label={t('email')}
                    id="email"
                    placeholder={t('emailPlaceholder')}
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <Password
                    label={t('password')}
                    id="password"
                    placeholder={t('passwordPlaceholder')}
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.password?.message}
                    {...register("password")}
                />
                <Password
                    label={t('confirmPassword')}
                    id="confirmPassword"
                    placeholder={t('confirmPasswordPlaceholder')}
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />
                <Input
                    label={t('role')}
                    id="role"
                    placeholder={t('rolePlaceholder')}
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.role?.message}
                    {...register("role")}
                />
                <p className="text-red-500 text-sm">
                    {(errors as any)?.message?.message}
                </p>

                {serverError && (
                    <div className="border border-red-300 p-3 rounded-md bg-red-50 dark:bg-red-100/10">
                        <p className="text-red-600 text-sm font-medium">{serverError}</p>
                    </div>
                )}

                <FormStatusButton
                    className="w-full @xl:w-full dark:bg-[#090909] dark:text-white hover:dark:bg-black"
                    type="submit"
                    size={isMedium ? "lg" : "lg"}>
                    <span>{t('signupBtn')}</span>
                    <PiArrowRightBold className={cn("ms-2 mt-0.5 h-5 w-5", params.locale === 'ar' ? 'rotate-180' : 'rotate-0')} />
                </FormStatusButton>
            </div>
        </form>
    );
}

export default SignupForm;

"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PiArrowRightBold } from "react-icons/pi";
import { Password, Input, Select } from "rizzui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { FormStatusButton } from "@/components/formStatusButton";
import { Signup, signup } from "@/validators/signup.validator";
import { UserRegisterForm } from "@/utils/api";
import { UserRole } from "@/types/userRoles";
import { toast } from "sonner";
import { Params } from "@/types/params";
import { useTranslations } from "next-intl";

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
};

function UserForm() {
    const router = useRouter();
    const params = useParams<Params>();
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations('UserPages.createUserPage');
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Signup>({
        resolver: zodResolver(signup),
        defaultValues: { ...initialValues },
    });

    const onSubmit = async (state: Signup) => {
        setIsLoading(true);
        setServerError(null);

        try {
            const data = await UserRegisterForm(state);
            if (data.succeeded) {
                toast.success(data.message);
                router.push(`/${params.locale}${routes.user.list}`);
            } else {
                setServerError(data.message || "Failed to create user");
            }
        } catch (error: any) {
            console.error("Error creating user:", error);
            setServerError(error?.response?.data?.message || "An error occurred while creating the user");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-col py-6">
                <div>
                    <h1 className="mb-4 text-2xl font-semibold">{t('title')}</h1>
                    <p className="mb-6 text-gray-600">{t('description')}</p>
                </div>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input
                                type="text"
                                size="lg"
                                label={t('form.firstName')}
                                id="firstName"
                                placeholder={t('form.firstNamePlaceholder')}
                                className="[&>label>span]:font-medium"
                                inputClassName="text-sm"
                                error={errors.firstName?.message}
                                {...register("firstName")}
                            />
                            <Input
                                type="text"
                                size="lg"
                                label={t('form.lastName')}
                                id="lastName"
                                placeholder={t('form.lastNamePlaceholder')}
                                className="[&>label>span]:font-medium"
                                inputClassName="text-sm"
                                error={errors.lastName?.message}
                                {...register("lastName")}
                            />
                        </div>

                        <Input
                            type="email"
                            size="lg"
                            label={t('form.email')}
                            id="email"
                            placeholder={t('form.emailPlaceholder')}
                            className="[&>label>span]:font-medium"
                            inputClassName="text-sm"
                            error={errors.email?.message}
                            {...register("email")}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Password
                                label={t('form.password')}
                                id="password"
                                placeholder={t('form.passwordPlaceholder')}
                                size="lg"
                                className="[&>label>span]:font-medium"
                                inputClassName="text-sm"
                                error={errors.password?.message}
                                {...register("password")}
                            />
                            <Password
                                label={t('form.confirmPassword')}
                                id="confirmPassword"
                                placeholder={t('form.confirmPasswordPlaceholder')}
                                size="lg"
                                className="[&>label>span]:font-medium"
                                inputClassName="text-sm"
                                error={errors.confirmPassword?.message}
                                {...register("confirmPassword")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Select
                                label={t('form.role')}
                                id="role"
                                options={Object.values(UserRole).map((option) => ({
                                    label: option,
                                    value: option
                                }))}
                                value={watch("role") ?? undefined}
                                onChange={(value) => setValue("role", value ? String(value) : "")}
                                getOptionValue={(option) => option.value}
                                displayValue={(selected: string | undefined) =>
                                    selected !== undefined
                                        ? Object.values(UserRole).find(opt => opt === selected) || ""
                                        : ""
                                }
                                placeholder={t('form.rolePlaceholder')}
                                size="lg"
                                className="[&>label>span]:font-medium"
                            />
                            {errors.role?.message && (
                                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                            )}
                        </div>
                        {serverError && (
                            <div className="border border-red-300 p-3 rounded-md bg-red-50 dark:bg-red-100/10">
                                <p className="text-red-600 text-sm font-medium">{serverError}</p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4 justify-between">
                            <FormStatusButton
                                type="button"
                                size="lg"
                                onClick={() => router.push(`/${params.locale}${routes.user.list}`)}
                                disabled={isLoading}
                                className="bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-100 dark:bg-gray-100 dark:text-gray-900 dark:border-gray-500 dark:hover:bg-gray-200"
                            >
                                {t('btn.cancel')}
                            </FormStatusButton>

                            <FormStatusButton
                                type="submit"
                                size="lg"
                                disabled={isLoading}
                                className="flex items-center justify-center"
                            >
                                {isLoading ? t('btn.creating') : t('btn.createUser')}
                                <PiArrowRightBold className="ml-2 mt-0.5 h-5 w-5" />
                            </FormStatusButton>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserForm;

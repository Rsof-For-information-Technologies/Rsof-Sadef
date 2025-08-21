"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PiArrowRightBold } from "react-icons/pi";
import { Input, Select } from "rizzui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { routes } from "@/config/routes";
import { FormStatusButton } from "@/components/formStatusButton";
import { UserRole } from "@/types/userRoles";
import { toast } from "sonner";
import { getUserById, updateUser } from "@/utils/api";
import { User } from "@/types/user";
import { updateUserSchema, UpdateUserFormData } from "@/validators/user.validator";
import { Params } from "@/types/params";
import { useTranslations } from "next-intl";

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    role: "",
};

function UpdateUserForm() {
    const router = useRouter();
    const params = useParams<Params & { userId: string }>();
    const userId = params.userId as string;
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const t = useTranslations('UserPages.updateUserPage');
    const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: { ...initialValues },
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await getUserById(userId);
                if (response.succeeded && response.data) {
                    setUser(response.data);
                    reset({
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        email: response.data.email,
                        role: response.data.role,
                    });
                }
            } catch (error) {
                console.error("Error loading user:", error);
                toast.error("Failed to load user data");
            }
        };

        if (userId) {
            loadUser();
        }
    }, [userId, reset]);

    const onSubmit = async (state: UpdateUserFormData) => {
        setIsLoading(true);
        setServerError(null);

        try {
            const data = await updateUser({
                userId: userId,
                ...state,
            });
            if (data.succeeded) {
                toast.success(data.message);
                router.push(`/${params.locale}${routes.user.list}`);
            } else {
                setServerError(data.message || "Failed to update user");
            }
        } catch (error: any) {
            console.error("Error updating user:", error);
            setServerError(error?.response?.data?.message || "An error occurred while updating the user");
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
                                className="bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-100"
                                type="button"
                                size="lg"
                                onClick={() => router.push(`/${params.locale}${routes.user.list}`)}
                                disabled={isLoading}
                            >
                                {t('btn.cancel')}
                            </FormStatusButton>
                            <FormStatusButton
                                className="flex items-center justify-center"
                                type="submit"
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? t('btn.updating') : t('btn.updateUser')}
                                <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
                            </FormStatusButton>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateUserForm;

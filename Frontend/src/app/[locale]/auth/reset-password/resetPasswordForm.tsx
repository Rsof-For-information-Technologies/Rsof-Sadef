"use client";

import { FormStatusButton } from '@/components/formStatusButton';
import { Params } from '@/types/params';
import { resetPasswordValidator, ResetPassword } from '@/validators/resetPassword.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PiArrowRightBold } from 'react-icons/pi';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import useMedia from "react-use/lib/useMedia";
import { Password } from 'rizzui';
import { toast } from 'sonner';
import { UserResetPasswordForm } from '@/utils/api';
import { routes } from '@/config/routes';
import { useTranslations } from 'next-intl';
import cn from '@/utils/class-names'

const initialValues = {
    newPassword: "",
    confirmNewPassword: "",
};

function ResetPasswordForm({ email }: { email: string }) {
    const isMedium = useMedia('(max-width: 1200px)', false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams<Params>();
    const t = useTranslations("ResetPasswordPage.form");

    const { register, formState: { errors }, reset, setError, handleSubmit } = useForm<ResetPassword>({
        resolver: zodResolver(resetPasswordValidator),
        defaultValues: {...initialValues}
    });

    const submitForm = async (state: ResetPassword) => {
        try {
        const resetToken = searchParams.get("token");
        const email = searchParams.get("email");

        if (!email) {
            toast.error("Reset email not found.");
            return;
        }

        if (!resetToken) {
            toast.error("Reset token not found.");
            return;
        }

        const payload = {
            email,
            resetToken,
            newPassword: state.newPassword,
            confirmNewPassword: state.confirmNewPassword,
        };

        const data = await UserResetPasswordForm(payload);

        if (data?.succeeded) {
            toast.success(data.message ||"Password reset successfully");
            reset();
            router.push(`/${params.locale}${routes.auth.login}`);
        } else {
            toast.error(data?.message || "Something went wrong!");
        }
        } catch (error: any) {
        console.log(error);
        const serverErrors = error.response?.data;

        if (serverErrors?.message) {
            toast.error(serverErrors.message);
        }

        if (serverErrors && Object.entries(serverErrors).length) {
            for (let [key, value] of Object.entries(serverErrors)) {
            setError(key as any, { type: "server", message: value as string });
            }
        }
        }
    };

    return (
        <div className="flex w-full flex-col justify-between">
            <p className="text-center mb-10">
                {t('description.line1', { email })}
            </p>
            <form action={() => handleSubmit(submitForm)()}>
                <div className="space-y-6">
                <Password
                    label={t('newPassword')}
                    id="newPassword"
                    placeholder={t('newPasswordPlaceholder')}
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.newPassword?.message}
                    {...register("newPassword")}
                />
                <Password
                    label={t('confirmPassword')}
                    id="confirmNewPassword"
                    placeholder={t('confirmPasswordPlaceholder')}
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.confirmNewPassword?.message}
                    {...register("confirmNewPassword")}
                />
                <p className="text-red-500 text-sm">{(errors as any)?.message?.message}</p>
                <FormStatusButton
                    className="w-full @xl:w-full dark:bg-[#090909] dark:text-white hover:dark:bg-black"
                    type="submit"
                    size={isMedium ? 'lg' : 'lg'}>
                    <span>{t('resetButton')}</span>
                    <PiArrowRightBold className={cn("ms-2 mt-0.5 h-5 w-5", params.locale === 'ar' ? 'rotate-180' : 'rotate-0')} />
                </FormStatusButton>
                </div>
            </form>
        </div>
    );
}

export default ResetPasswordForm;


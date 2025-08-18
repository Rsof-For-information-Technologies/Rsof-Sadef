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

const initialValues = {
    newPassword: "",
    confirmNewPassword: "",
};

function ResetPasswordForm({ email }: { email: string }) {
    const isMedium = useMedia('(max-width: 1200px)', false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams<Params>();

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
            <div className="flex w-full flex-col justify-center px-5">
                <div className="mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-xl 2xl:pb-8 2xl:pt-2">
                    <p className="text-center mb-10">
                        Enter a new password for your {email}
                    </p>
                    <form action={() => handleSubmit(submitForm)()}>
                        <div className="space-y-6">
                        <Password
                            label="New Password"
                            id="newPassword"
                            placeholder="Enter your password"
                            size="lg"
                            className="[&>label>span]:font-medium"
                            inputClassName="text-sm"
                            error={errors.newPassword?.message}
                            {...register("newPassword")}
                        />
                        <Password
                            label="Confirm Password"
                            id="confirmNewPassword"
                            placeholder="Enter your password"
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
                            <span> Reset password </span>
                            <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
                        </FormStatusButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordForm;


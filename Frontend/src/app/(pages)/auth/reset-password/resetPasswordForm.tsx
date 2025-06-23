"use client";

import { FormStatusButton } from '@/components/formStatusButton';
import { Params } from '@/types/params';
import { clientAxiosInstance } from '@/utils/axios.instance';
import { resetPasswordValidator, T_ResetPasswordBody } from '@/validators/resetPassword.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import useMedia from "react-use/lib/useMedia";
import { Input } from 'rizzui'
import { toast } from 'sonner';

export default function ResetPasswordForm({ email }: { email: string}) {
    const isMedium = useMedia('(max-width: 1200px)', false);
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams<Params>();
    const { watch, register, formState: { errors }, reset, setError, handleSubmit } = useForm<T_ResetPasswordBody>({
        resolver: zodResolver(resetPasswordValidator),
        mode: "all",
        defaultValues: {
            email: "",
            confirmNewPassword: "",
            newPassword: "",
        }
    })

    const submitForm: SubmitHandler<T_ResetPasswordBody> = async (state) => {
        try {
            const token = searchParams.get("token")
            const { data } = await clientAxiosInstance.post(`/api/v1/user/reset-password?token=${token}`, state);
            router.push(`/${params.locale}/login`)
            reset()
            toast.success("Password reset successfully")
        } catch (error) {
            console.log(error)
            if (error instanceof AxiosError) {
                const serverErrors = Object.entries(error.response?.data)
                if (serverErrors.length) {
                    for (let [key, value] of serverErrors) {
                        setError(key as any, { type: 'server', message: value as string })
                    }
                }
            }
        }
    }

    return (
        <div className="flex w-full flex-col justify-between" >
            <div className=" flex w-full flex-col justify-center px-5">
                <div className=" mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-xl 2xl:pb-8 2xl:pt-2">
                    <p className="text-center mb-10">
                        Enter a new password for your {email}
                    </p>
                    <form action={() => handleSubmit(submitForm)()}>
                        <div className="space-y-6">
                            <Input
                                className="[&>label>span]:font-medium"
                                size={isMedium ? 'lg' : 'xl'}
                                placeholder="Enter new password"
                                label="New password"
                                id='newPassword'
                                value={watch().newPassword}
                                {...register("newPassword")}
                                error={errors.newPassword?.message}
                            />
                            <Input
                                className="[&>label>span]:font-medium"
                                label="Confirm new Password"
                                placeholder="Confirm new Password"
                                id='confirmNewPassword'
                                value={watch().confirmNewPassword}
                                {...register("confirmNewPassword")}
                                error={errors.confirmNewPassword?.message}
                            />
                            <p className='text-red-500 text-sm'>{(errors as any)?.message?.message}</p>

                            <FormStatusButton
                                className="w-full @xl:w-full bg-[#4675db] hover:bg-[#1d58d8] dark:hover:bg-[#1d58d8] dark:text-white"
                                type="submit"
                                size='lg'>
                                <span>
                                    Reset password
                                </span>
                            </FormStatusButton>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

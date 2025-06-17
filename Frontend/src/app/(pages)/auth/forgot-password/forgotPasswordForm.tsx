"use client";
import { FormStatusButton } from "@/components/formStatusButton";
import { routes } from "@/config/routes";
import { Params } from "@/types/params";
import { clientAxiosInstance } from "@/utils/axios.instance";
import { ForgetPasswordBody, forgetPasswordValidator } from "@/validators/forgetPassword.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Metadata } from "next";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import useMedia from "react-use/lib/useMedia";
import { Input, Text } from "rizzui";
import { toast } from "sonner";

const initialValues = {
    email: "",
}

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset your password",
};

export default function ForgotPasswordForm() {
    const isMedium = useMedia('(max-width: 1200px)', false);
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<ForgetPasswordBody>({
        resolver: zodResolver(forgetPasswordValidator),
        defaultValues: { ...initialValues }
    })
    const onSubmit = async (state: ForgetPasswordBody) => {
        try {
            const { data } = await clientAxiosInstance.post('/api/v1/user/forgot-password', state)
            console.log(data)
            router.push(`/${routes.auth.forgotPassword}`)
            toast.success("Reset link sent successfully to the email");
            reset()
        } catch (error) {

            if ((error as any).response?.data && Object.entries((error as any).response?.data).length) {
                for (let [key, value] of Object.entries((error as any).response?.data)) {
                    setError(key as any, { type: 'custom', message: value as string })
                }
            }
        }
    };

    return (
        <div className="flex w-full flex-col justify-between">
            <div className=" flex w-full flex-col justify-center px-5">
                <div className=" mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-xl 2xl:pb-8 2xl:pt-2">
                    <h1 className="mb-7 text-center text-[28px] font-bold leading-snug md:text-3xl md:!leading-normal lg:mb-10 lg:text-4xl lea">
                        Having trouble to sign in? <br className="hidden sm:inline-block" />
                        Reset your password.
                    </h1>
                    <form action={() => handleSubmit(onSubmit)()}>
                        <div className="space-y-6">
                            <Input
                                type="email"
                                size={isMedium ? 'lg' : 'xl'}
                                label="Email"
                                placeholder="Enter your email"
                                className="[&>label>span]:font-medium"
                                error={errors.email?.message}
                                {...register('email')}
                            />
                            <p className='text-red-500 text-sm'>{(errors as any)?.message?.message}</p>
                            <FormStatusButton
                                className="w-full @xl:w-full  dark:bg-[#090909] dark:text-white hover:dark:bg-black"
                                type="submit"
                                size={isMedium ? 'lg' : 'xl'}>
                                <span>
                                    Reset password
                                </span>
                            </FormStatusButton>
                        </div>
                    </form>
                </div>
                <Text className="mt-6 text-center text-[15px] leading-loose text-gray-500 md:mt-7 lg:mt-9 lg:text-base">
                    Don't want to reset?{" "}
                    <Link
                        href={routes.auth.login}
                        className="font-semibold text-gray-700 transition-colors hover:text-primary"
                    >
                        Sign in
                    </Link>
                </Text>
            </div>
        </div >
    );
}

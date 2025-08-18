"use client";
import { FormStatusButton } from "@/components/formStatusButton";
import { routes } from "@/config/routes";
import { ForgetPassword, forgetPasswordValidator } from "@/validators/forgetPassword.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PiArrowRightBold } from 'react-icons/pi'
import Link from "next/link";
import { useForm } from "react-hook-form";
import useMedia from "react-use/lib/useMedia";
import { Input, Text } from "rizzui";
import { toast } from "sonner";
import { UserForgotPasswordForm } from "@/utils/api";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Params } from "@/types/params";

const initialValues = {
    email: "",
};

export default function ForgotPasswordForm() {
    const isMedium = useMedia("(max-width: 1200px)", false);
    const t = useTranslations("ForgotPasswordPage");
    const { locale } = useParams<Params>()

    const { register, handleSubmit, formState: { errors }, setError, reset, } = useForm<ForgetPassword>({
        resolver: zodResolver(forgetPasswordValidator),
        defaultValues: { ...initialValues },
    });

    const onSubmit = async (state: ForgetPassword) => {
        try {
            const payload = {
                email: state.email,
                clientUrl: "http://localhost:3010/auth/reset-password",
            };
            const data = await UserForgotPasswordForm(payload);

            console.log(data);

            if (!data.succeeded) {
                toast.error(data.message || "Something went wrong");
                return;
            }

            toast.success(data.message || "Reset link sent successfully to the email");
            reset();
        } catch (error) {
            if (
                (error as any).response?.data &&
                Object.entries((error as any).response?.data).length
            ) {
                for (let [key, value] of Object.entries((error as any).response?.data)) {
                    setError(key as any, { type: "custom", message: value as string });
                }
            }
        }
    };

    return (
        <div className="flex w-full flex-col justify-between">
            <div className="flex w-full flex-col justify-center px-5">
                <div className="mx-auto w-full max-w-md pb-12 md:max-w-lg lg:max-w-xl 2xl:pb-8 2xl:pt-2">
                    <form action={() => handleSubmit(onSubmit)()}>
                        <div className="space-y-6">
                            <Input
                                type="email"
                                size="lg"
                                label={t('form.email')}
                                placeholder={t('form.emailPlaceholder')}
                                className="[&>label>span]:font-medium"
                                error={errors.email?.message}
                                {...register("email")}
                            />
                            <p className="text-red-500 text-sm">
                                {(errors as any)?.message?.message}
                            </p>
                            <FormStatusButton
                                className="group w-full @xl:w-full dark:bg-[#090909] dark:text-white hover:dark:bg-black "
                                type="submit"
                                size={isMedium ? 'lg' : 'xl'}>
                                <span>{t('form.resetButton')}</span>
                                <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5 group-hover:translate-x-1 group-hover:scale-105 transition-transform transform-all" />
                            </FormStatusButton>
                        </div>
                    </form>
                </div>
                <Text className="mt-6 text-center text-[15px] leading-loose text-gray-500 md:mt-7 lg:mt-9 lg:text-base">
                    {t('footer.text1')}{" "}
                    <Link
                        href={`/${locale}${routes.auth.login}`}
                        className="font-semibold text-gray-700 transition-colors hover:text-primary"
                    >
                        {t('footer.text2')}
                    </Link>
                </Text>
            </div>
        </div>
    );
}

"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PiArrowRightBold } from "react-icons/pi";
import { Password, Input } from "rizzui";
import { zodResolver } from "@hookform/resolvers/zod";
import useMedia from "react-use/lib/useMedia";
import { useRouter, useSearchParams } from "next/navigation";
import { routes } from "@/config/routes";
import { removeLocalStorage, setLocalStorage } from "@/utils/localStorage";
import { FormStatusButton } from "@/components/formStatusButton";
import { Signup, signup } from "@/validators/signup.validator";
import { UserRegisterForm } from "@/utils/api";

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
    const [serverError, setServerError] = useState<string | null>(null);
    const isMedium = useMedia("(max-width: 1200px)", false);

    const { register, handleSubmit, formState: { errors }, setError, } = useForm<Signup>({
        resolver: zodResolver(signup),
        defaultValues: { ...initialValues },
    });

    const onSubmit = async (state: Signup) => {
        try {
            const data = await UserRegisterForm(state);
            console.log({ data });

            if (data.succeeded) {
                setLocalStorage("user-info", data);
                router.push(`/`);
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
            router.push(`/${routes.auth.signup}?${urlSearchParams}`);
        }
    }, [logout, router, searchParams]);

    return (
        <form action={() => handleSubmit(onSubmit)()}>
            <div className="space-y-5">
                <Input
                    type="text"
                    size="lg"
                    label="First Name"
                    id="firstName"
                    placeholder="Enter your first name"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.firstName?.message}
                    {...register("firstName")}
                />
                <Input
                    type="text"
                    size="lg"
                    label="Last Name"
                    id="lastName"
                    placeholder="Enter your last name"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.lastName?.message}
                    {...register("lastName")}
                />
                <Input
                    type="email"
                    size="lg"
                    label="Email"
                    id="email"
                    placeholder="Enter your email"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <Password
                    label="Password"
                    id="password"
                    placeholder="Enter your password"
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.password?.message}
                    {...register("password")}
                />
                <Password
                    label="Confirm Password"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />
                <Input
                    label="Role"
                    id="role"
                    placeholder="Enter your role"
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
                    <span>Signup</span>
                    <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
                </FormStatusButton>
            </div>
        </form>
    );
}

export default SignupForm;

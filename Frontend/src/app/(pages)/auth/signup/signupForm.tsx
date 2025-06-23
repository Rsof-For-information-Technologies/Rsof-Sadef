"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { PiArrowRightBold } from 'react-icons/pi'
import { Password, Input } from 'rizzui';
import { zodResolver } from "@hookform/resolvers/zod";
import useMedia from 'react-use/lib/useMedia'
import { useRouter, useSearchParams } from 'next/navigation'
import { routes } from '@/config/routes'
import { clientAxiosInstance } from '@/utils/axios.instance'
import { DeleteLocalStorage, setLocalStorage } from '@/utils/localStorage'
import { FormStatusButton } from '@/components/formStatusButton'
import { Signup, signup } from '@/validators/signup.validator'

const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    // isAgreed: false,
}

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const isMedium = useMedia('(max-width: 1200px)', false);
    const { register, handleSubmit, formState: { errors }, setError, } = useForm<Signup>({
        resolver: zodResolver(signup),
        defaultValues: { ...initialValues }
    })

    const onSubmit = async (state: Signup) => {

        try {
            const { data } = await clientAxiosInstance.post('/api/v1/user/register', state);

            console.log({ data })
            setLocalStorage("user-info", data);

            if (searchParams.get("navigate_to"))
                router.push(`${searchParams.get("navigate_to")}`)

            else {
                router.push(`/`)
            }

        } catch (error) {
            console.log(error)
            if ((error as any).response?.data && Object.entries((error as any).response?.data).length) {
                for (let [key, value] of Object.entries((error as any).response?.data)) {
                    setError(key as any, { type: 'custom', message: value as string })
                }
            }
        }
    };
    const logout = searchParams.get("logout")
    useEffect(() => {

        if (logout === "true") {
            const urlSearchParams = new URLSearchParams(searchParams.toString());

            DeleteLocalStorage("user-info");
            // setUserInfo()

            urlSearchParams.delete("logout");
            router.push(`/${routes.auth.signup}?${urlSearchParams}`)
        }
    }, [logout, router, searchParams])

    return (
        <form action={() => handleSubmit(onSubmit)()}>
            <div className="space-y-5">
                <Input
                    type="text"
                    size="lg"
                    label="First Name"
                    id='firstname'
                    placeholder="Enter your first name"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.firstname?.message}
                    {...register('firstname')}
                />
                <Input
                    type="text"
                    size="lg"
                    label="Last Name"
                    id='lastname'
                    placeholder="Enter your last name"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.lastname?.message}
                    {...register('lastname')}
                />
                <Input
                    type="email"
                    size="lg"
                    label="Email"
                    id='email'
                    placeholder="Enter your email"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.email?.message}
                    {...register('email')}
                />
                <Password
                    label="Password"
                    id='password'
                    placeholder="Enter your password"
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.password?.message}
                    {...register('password')}
                />
                <Password
                    label="Confirm Password"
                    id='confirmPassword'
                    placeholder="Confirm your password"
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                />

                <Input
                    label="Role"
                    id='role'
                    placeholder="Enter your role"
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.role?.message}
                    {...register('role')}
                />
                {/* <div className="col-span-2 flex items-start text-gray-700">
                    <Checkbox
                        {...register('isAgreed')}
                        className="[&>label.items-center]:items-start [&>label>div.leading-none]:mt-0.5 [&>label>div.leading-none]:sm:mt-0 [&>label>span]:font-medium"
                        label={
                            <Text as="span" className="ps-1 text-gray-500">
                            By signing up you have agreed to our{' '}
                            <Link
                                href="/"
                                className="font-semibold text-gray-700 transition-colors hover:text-primary"
                            >
                                Terms
                            </Link>{' '}
                            &{' '}
                            <Link
                                href="/"
                                className="font-semibold text-gray-700 transition-colors hover:text-primary"
                            >
                                Privacy Policy
                            </Link>
                            </Text>
                        }
                    />
                </div> */}
                <p className='text-red-500 text-sm'>{(errors as any)?.message?.message}</p>
                <FormStatusButton
                    className="w-full @xl:w-full bg-[#4675db] hover:bg-[#1d58d8] dark:hover:bg-[#1d58d8] dark:text-white"
                    type="submit"
                    size={isMedium ? 'lg' : 'xl'}>
                    <span>signup</span>
                    <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
                </FormStatusButton>
            </div>
        </form>
    )
}

export default SignupForm
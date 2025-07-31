import { z } from 'zod';

export const signup = z.object({
    firstName: z.string({ required_error: "First name is required." })
        .min(1, "First name is required."),
    lastName: z.string({ required_error: "Last name is required." })
        .min(1, "Last name is required."),
    email: z.string({ required_error: "Email is required." })
        .min(1, "Email is required."),
    password: z.string({ required_error: "Password is required." })
        .min(1, "Password is required."),
    confirmPassword: z.string({ required_error: "Confirm password is required." })
        .min(1, "Confirm password is required."),
    role: z.string({ required_error: "Role is required." })
        .min(1, "Role is required."),
    // isAgreed: z.boolean().refine(val => val === true, {
    //     message: "You must agree to the terms and conditions."
    // }),
    rememberMe: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

export type Signup = z.infer<typeof signup>
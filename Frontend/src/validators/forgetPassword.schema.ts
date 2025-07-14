import { z } from 'zod';

export const forgetPasswordValidator = z.object({
    email: z.string({ required_error: "Email is required." })
        .email("Enter email address")
        .min(1, "Email is required.")
        .min(10, "Email must be at least 10 characters long.")
        .max(50, "Email must not exceed 50 characters."),
});

export type ForgetPassword = z.infer<typeof forgetPasswordValidator>
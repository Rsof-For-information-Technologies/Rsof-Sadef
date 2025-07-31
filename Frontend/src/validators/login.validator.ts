import { z } from 'zod';

export const login = z.object({
    email: z.string({ required_error: "Email is required." })
        .min(1, "Email is required."),
    password: z.string({ required_error: "Password is required." })
        .min(1, "Password is required."),
    rememberMe: z.boolean().optional(),
});

export type Login = z.infer<typeof login>
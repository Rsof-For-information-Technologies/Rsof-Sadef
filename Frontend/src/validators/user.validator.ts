import { z } from 'zod';

export const updateUserSchema = z.object({
    firstName: z.string({ required_error: "First name is required." })
        .min(1, "First name is required."),
    lastName: z.string({ required_error: "Last name is required." })
        .min(1, "Last name is required."),
    email: z.string({ required_error: "Email is required." })
        .email("Please enter a valid email address."),
    role: z.string({ required_error: "Role is required." })
        .min(1, "Role is required."),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

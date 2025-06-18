import { z } from "zod";

export const resetPasswordValidator = z.object({
    newPassword: z.string({ required_error: "New Password is required." })
        .min(1, { message: "New Password is required." })
        .min(6, "Password must be at least 6 characters long.")
        .max(50, "Password must not exceed 50 characters."),
    confirmNewPassword: z.string({ required_error: "New confirmed Password is required." })
        .min(1, { message: "New confirmed Password is required." })
        .min(6, "New Password must be at least 6 characters long.")
        .max(50, "Password must not exceed 50 characters.")
}).refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"]
})

export type T_ResetPasswordBody = z.infer<typeof resetPasswordValidator>


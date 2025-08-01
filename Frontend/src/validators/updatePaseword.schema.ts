import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    userId: z.string().min(1, 'User ID is required'),
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must not exceed 32 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number and special character'
      ),
    confirmNewPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

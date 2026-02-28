import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .email({
      message: 'Invalid email address',
    })
    .max(254, {
      message: 'Email must be at most 254 characters long',
    }),
  password: z
    .string()
    .min(6, {
      message: 'Password must contain at least 6 characters',
    })
    .max(128, {
      message: 'Password must be at most 128 characters long',
    }),
  code: z
    .string()
    .length(6, { message: 'Invalid 2FA code' })
    .regex(/^\d+$/, { message: 'Invalid 2FA code' })
    .optional(),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

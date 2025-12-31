import { z } from 'zod';

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, {
        message: 'Name must contain at least 1 character',
      })
      .max(50, {
        message: 'Name must be at most 50 characters long',
      }),
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
    passwordRepeat: z
      .string()
      .min(6, {
        message: 'Password confirmation must contain at least 6 characters',
      })
      .max(128, {
        message: 'Password confirmation must be at most 128 characters long',
      }),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: 'Passwords do not match',
    path: ['passwordRepeat'],
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

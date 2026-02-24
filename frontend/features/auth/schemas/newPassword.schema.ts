import z from 'zod';

export const NewPasswordSchema = z.object({
  password: z
    .string({
      message: 'Password should be a string',
    })
    .min(6, {
      message: 'Password should contain at least 6 characters',
    })
    .max(128, {
      message: 'Password must be at most 128 characters long',
    }),
});

export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;

import z from 'zod';

export const SettingsSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Name must contain at least one character',
    })
    .max(50, 'Name must be at most 50 characters long'),
  email: z
    .email({
      message: 'Invalid email address',
    })
    .max(254, {
      message: 'Email must be at most 254 characters long',
    }),
  isTwoFactorEnabled: z.boolean(),
});

export type SettingsSchemaType = z.infer<typeof SettingsSchema>;

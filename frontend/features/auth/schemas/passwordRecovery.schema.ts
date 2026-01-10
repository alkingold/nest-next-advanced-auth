import { z } from 'zod';

export const PasswordRecoverySchema = z.object({
  email: z.email({
    message: 'Incorrect email format',
  }),
});

export type PasswordRecoverySchemaType = z.infer<typeof PasswordRecoverySchema>;

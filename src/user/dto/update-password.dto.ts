import { z } from 'zod';

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z.string(),
  })
  .required();

export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;

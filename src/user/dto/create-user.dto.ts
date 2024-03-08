import { z } from 'zod';

export const createUserSchema = z
  .object({
    login: z.string(),
    password: z.string(),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;

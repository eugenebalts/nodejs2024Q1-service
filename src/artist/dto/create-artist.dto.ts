import { z } from 'zod';

export const createArtistSchema = z
  .object({
    name: z.string(),
    grammy: z.boolean(),
  })
  .strict()
  .required();

export type CreateArtistDto = z.infer<typeof createArtistSchema>;

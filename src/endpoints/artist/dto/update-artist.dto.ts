import { z } from 'zod';

export const updateArtistSchema = z
  .object({
    name: z.string().optional(),
    grammy: z.boolean().optional(),
  })
  .strict();

export type UpdateArtistDto = z.infer<typeof updateArtistSchema>;

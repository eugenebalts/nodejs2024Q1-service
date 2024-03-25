import { z } from 'zod';

export const createAlbumSchema = z
  .object({
    name: z.string(),
    year: z.number(),
    artistId: z.string().nullable(),
  })
  .strict()
  .required();

export type CreateAlbumDto = z.infer<typeof createAlbumSchema>;

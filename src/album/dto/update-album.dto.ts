import { z } from 'zod';

export const updateAlbumSchema = z
  .object({
    name: z.string().optional(),
    year: z.number(),
    artistId: z.string().nullable(),
  })
  .strict();

export type UpdateAlbumDto = z.infer<typeof updateAlbumSchema>;

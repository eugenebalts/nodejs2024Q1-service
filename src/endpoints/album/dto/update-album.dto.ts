import { z } from 'zod';

export const updateAlbumSchema = z
  .object({
    name: z.string().optional(),
    year: z.number().optional(),
    artistId: z.string().nullable().optional(),
  })
  .strict();

export type UpdateAlbumDto = z.infer<typeof updateAlbumSchema>;

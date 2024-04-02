import { z } from 'zod';

export const updateTrackSchema = z
  .object({
    name: z.string().optional(),
    artistId: z.string().uuid().nullable().optional(),
    albumId: z.string().uuid().nullable().optional(),
    duration: z.number().int().optional(),
  })
  .strict();

export type UpdateTrackDto = z.infer<typeof updateTrackSchema>;

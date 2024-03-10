import { z } from 'zod';

export const updateTrackSchema = z.object({
  name: z.string().optional(),
  artistId: z.string().nullable().optional(),
  albumId: z.string().nullable().optional(),
  duration: z.number().int().optional(),
});

export type UpdateTrackDto = z.infer<typeof updateTrackSchema>;

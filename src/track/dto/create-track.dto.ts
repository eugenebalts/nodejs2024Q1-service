import { z } from 'zod';

export const createTrackSchema = z
  .object({
    name: z.string(),
    artistId: z.string().uuid().nullable(),
    albumId: z.string().uuid().nullable(),
    duration: z.number().int(),
  })
  .strict()
  .required();

export type CreateTrackDto = z.infer<typeof createTrackSchema>;

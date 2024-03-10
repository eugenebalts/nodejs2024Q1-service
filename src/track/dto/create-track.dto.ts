import { z } from 'zod';

export const createTrackSchema = z
  .object({
    name: z.string(),
    artistId: z.string().nullable(),
    albumId: z.string().nullable(),
    duration: z.number().int(),
  })
  .strict()
  .required();

export type CreateTrackDto = z.infer<typeof createTrackSchema>;

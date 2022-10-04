import z from 'zod';

export const teamSchema = z.object({

  abbreviation: z.string(),
  city: z.string(),
  displayName: z.string(),
  id: z.number(),
  logo: z.string(),
  name: z.string(),

});

export type TeamSchema = z.TypeOf<typeof teamSchema>;
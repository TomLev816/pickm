import z from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.date().nullish(),
  image: z.string(),
});

export type UserSchema = z.TypeOf<typeof userSchema> 
import z from 'zod';
import { UserSchema } from './user.schema';

export const voteSchema = z.object({
  id: z.number(),
  userId: z.string(),
  gameId: z.number(),
  teamId: z.number(),
});

export type VoteSchema = z.TypeOf<typeof voteSchema> & {
  User: UserSchema;
};

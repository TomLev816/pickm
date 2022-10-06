import z from 'zod';

export const voteSchema = z.object({
  id: z.number(),
  userId: z.string(),
  gameId: z.number(),
  teamId: z.number(),
});

export type VoteSchema = z.TypeOf<typeof voteSchema>;
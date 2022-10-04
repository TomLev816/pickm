import z, { Schema } from 'zod';
import {TeamSchema} from '../schema/team.schema'

export const gameListSchema = z.object({
  date: z.date(),
  weekNum: z.number(),
  id: z.number(),
  season: z.number(),
  isFinal: z.boolean(),
  homeIsWinner: z.boolean(),
  awayIsWinner: z.boolean(),
  homeScore: z.number().nullable(),
  awayScore: z.number().nullable(),
});

export type GameList = z.TypeOf<typeof gameListSchema> & {
  home: TeamSchema;
  away: TeamSchema;
};
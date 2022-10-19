import { createRouter } from "./context";
import { z } from "zod";
import * as trpc from '@trpc/server';

export const gameRouter = createRouter()
.query("getWeekOfGames", {
  input: z
    .object({
      activeWeekNum: z.number(),
    })
    .nullish(),
  async resolve({ ctx, input }) {
    return await ctx.prisma.game.findMany({
      where: {
        weekNum: input?.activeWeekNum
      },
      select: {
        id: true,
        date: true,
        season: true,
        weekNum: true,
        isFinal: true,
        away: true,
        home: true,
        homeIsWinner: true,
        awayIsWinner: true,
        homeScore: true,
        awayScore: true,
      }
    })
  },
})
.mutation('finalizeGame', {
  input: z
  .object({
    gameId: z.number(),
  }),
  async resolve({ ctx, input }) {
    const { gameId } = input;
    try {
      const foundGame =
        (await ctx.prisma.game.findUnique({
          where: {
            id: gameId,
          },
        }));
      
      console.log(foundGame);
      if (foundGame) {
        const id = foundGame.id
        const updatedGame = foundGame
        // const updatedGame = await ctx.prisma.vote.update({
        //   where: {
        //     id,
        //   },
        //   data: {
        //     gameId, 
        //     teamId,
        //   },
        // });
        return updatedGame;
      }
    } catch (e: any) {
      throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: e.message });
    }
  },
})
.query("getHello", {
  input: z
    .object({
      text: z.string().nullish(),
    })
    .nullish(),
  resolve({ input }) {
    return {
      weekGreeting: `Getting Week Numbr ${input?.text ?? "Error"}`,
    };
  },
})
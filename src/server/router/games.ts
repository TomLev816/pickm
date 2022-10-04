import { createRouter } from "./context";
import { z } from "zod";

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
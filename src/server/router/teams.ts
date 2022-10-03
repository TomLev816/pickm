import { createRouter } from "./context";
import { z } from "zod";

export const teamRouter = createRouter()
  .query("getAllTeams", {
    async resolve({ ctx }) {
      return await ctx.prisma.team.findMany();
    },
  });

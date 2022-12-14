import * as trpc from '@trpc/server';
import { z } from 'zod';
import { createProtectedRouter } from './context';

export const voteRouter = createProtectedRouter()
  .mutation('add-vote', {
    input: z
    .object({
      gameId: z.number(),
      teamId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { gameId, teamId } = input;
      const userId = ctx.session.user.id;
      try {
        const foundVote =
          (await ctx.prisma.vote.findFirst({
            where: {
              gameId,
              userId,
            },
          }));
        
        console.log(foundVote);
        if (foundVote) {
          const id = foundVote.id
          const updatedVote = await ctx.prisma.vote.update({
            where: {
              id,
            },
            data: {
              gameId, 
              teamId,
            },
          });
          return updatedVote;
        }
        const createdVote = await ctx.prisma.vote.create({
          data: {
            userId, teamId, gameId,
          },
        });
        return createdVote;
      } catch (e: any) {
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: e.message });
      }
    },
  })
  .query('get-game-user-vote', {
    input: z
    .object({
      gameId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const userId = ctx.session.user.id;

      try {
        const vote = await ctx.prisma.vote.findFirst({
          where: {
            userId: userId,
            gameId: input?.gameId,
          },
        });

        if (!vote) {
          return undefined
        }
        
        return vote;
      } catch (e: any) {
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: e.message });
      }
    },
  })
  .query('get-game-vote-count', {
    input: z
    .object({
      gameId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const userId = ctx.session.user.id;

      try {
        const vote = await ctx.prisma.vote.groupBy({
          by: ['teamId'],
          _count: true,
          where: {
            gameId: input?.gameId,
          },
        });

        if (!vote) {
          return undefined
        }
        
        return vote;
      } catch (e: any) {
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: e.message });
      }
    },
  })
  .query('get-game-vote-list', {
    input: z
    .object({
      gameId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const userId = ctx.session.user.id;

      try {
        const votes = await ctx.prisma.vote.findMany({
          where: {
            gameId: input?.gameId,
          },
          include: {
            User: true, 
          },
        });
        
        return votes;
      } catch (e: any) {
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: e.message });
      }
    },
  });
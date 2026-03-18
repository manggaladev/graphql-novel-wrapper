/**
 * User Resolver
 * Handles user profile operations
 */

import { Context } from '../context';
import { requireAuth } from '../context';

export const userResolver = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.getMe();
    },

    user: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      try {
        return await context.dataSources.novelApi.getUserProfile(id);
      } catch {
        return null;
      }
    },

    userNovels: async (
      _parent: unknown,
      { id, page, limit }: { id: string; page?: number; limit?: number },
      context: Context
    ) => {
      const result = await context.dataSources.novelApi.getUserNovels(id, { page, limit });

      return {
        edges: result.data.map((novel) => ({
          node: novel,
          cursor: Buffer.from(novel.id).toString('base64'),
        })),
        pageInfo: {
          hasNextPage: result.pagination.hasNext,
          hasPreviousPage: result.pagination.hasPrev,
          startCursor: result.data[0] ? Buffer.from(result.data[0].id).toString('base64') : null,
          endCursor: result.data[result.data.length - 1] ? Buffer.from(result.data[result.data.length - 1].id).toString('base64') : null,
        },
        totalCount: result.pagination.total,
      };
    },
  },
};

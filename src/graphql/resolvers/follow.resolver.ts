/**
 * Follow Resolver
 * Handles user follow/unfollow operations
 */

import { Context } from '../context';
import { requireAuth } from '../context';

export const followResolver = {
  Query: {
    followers: async (
      _parent: unknown,
      { userId, page, limit }: { userId: string; page?: number; limit?: number },
      context: Context
    ) => {
      const result = await context.dataSources.novelApi.getFollowers(userId, { page, limit });

      return {
        edges: result.data.map((user) => ({
          node: user,
          cursor: Buffer.from(user.id).toString('base64'),
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

    following: async (
      _parent: unknown,
      { userId, page, limit }: { userId: string; page?: number; limit?: number },
      context: Context
    ) => {
      const result = await context.dataSources.novelApi.getFollowing(userId, { page, limit });

      return {
        edges: result.data.map((user) => ({
          node: user,
          cursor: Buffer.from(user.id).toString('base64'),
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

    followStatus: async (
      _parent: unknown,
      { userId }: { userId: string },
      context: Context
    ) => {
      return context.dataSources.novelApi.getFollowStatus(userId);
    },
  },

  Mutation: {
    followUser: async (_parent: unknown, { userId }: { userId: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.followUser(userId);
    },

    unfollowUser: async (_parent: unknown, { userId }: { userId: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.unfollowUser(userId);
    },
  },
};

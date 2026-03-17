/**
 * Reading List Resolver
 * Handles reading list CRUD operations
 */

import { Context } from '../context';
import { requireAuth } from '../context';

export const readingListResolver = {
  Query: {
    myReadingLists: async (_parent: unknown, _args: unknown, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.getMyReadingLists();
    },

    readingList: async (
      _parent: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      try {
        return await context.dataSources.novelApi.getReadingList(id);
      } catch {
        return null;
      }
    },
  },

  Mutation: {
    createReadingList: async (
      _parent: unknown,
      { input }: { input: { name: string; description?: string; isPublic?: boolean } },
      context: Context
    ) => {
      requireAuth(context);
      return context.dataSources.novelApi.createReadingList(input);
    },

    updateReadingList: async (
      _parent: unknown,
      { id, input }: { id: string; input: { name?: string; description?: string; isPublic?: boolean } },
      context: Context
    ) => {
      requireAuth(context);
      return context.dataSources.novelApi.updateReadingList(id, input);
    },

    deleteReadingList: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.deleteReadingList(id);
    },

    addNovelToReadingList: async (
      _parent: unknown,
      { listId, novelId }: { listId: string; novelId: string },
      context: Context
    ) => {
      requireAuth(context);
      return context.dataSources.novelApi.addNovelToReadingList(listId, novelId);
    },

    removeNovelFromReadingList: async (
      _parent: unknown,
      { listId, novelId }: { listId: string; novelId: string },
      context: Context
    ) => {
      requireAuth(context);
      return context.dataSources.novelApi.removeNovelFromReadingList(listId, novelId);
    },
  },
};

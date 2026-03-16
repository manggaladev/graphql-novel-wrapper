import { Context } from '../context';
import { requireAuth } from '../context';

export const bookmarkResolver = {
  Query: {
    userBookmarks: async (
      _parent: unknown,
      { page, limit }: { page?: number; limit?: number },
      context: Context
    ) => {
      requireAuth(context);
      const result = await context.dataSources.novelApi.getBookmarks();

      return {
        edges: result.data.map((bookmark) => ({
          node: bookmark,
          cursor: Buffer.from(bookmark.id).toString('base64'),
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

  Mutation: {
    addBookmark: async (_parent: unknown, { novelId }: { novelId: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.addBookmark(novelId);
    },

    removeBookmark: async (_parent: unknown, { novelId }: { novelId: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.removeBookmark(novelId);
    },
  },

  Bookmark: {
    novel: async (parent: { novelId: string }, _args: unknown, context: Context) => {
      try {
        return await context.dataSources.novelApi.getNovelById(parent.novelId);
      } catch {
        return null;
      }
    },
  },
};

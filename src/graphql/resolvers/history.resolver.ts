import { Context } from '../context';
import { requireAuth } from '../context';

export const historyResolver = {
  Query: {
    userReadingHistory: async (
      _parent: unknown,
      { page, limit }: { page?: number; limit?: number },
      context: Context
    ) => {
      requireAuth(context);
      const result = await context.dataSources.novelApi.getReadingHistory({
        page: page || 1,
        limit: limit || 10,
      });

      return {
        edges: result.data.map((history) => ({
          node: history,
          cursor: Buffer.from(history.id).toString('base64'),
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

  ReadingHistory: {
    chapter: async (parent: { chapterId: string }, _args: unknown, context: Context) => {
      try {
        return await context.dataSources.novelApi.getChapterById(parent.chapterId);
      } catch {
        return null;
      }
    },
  },
};

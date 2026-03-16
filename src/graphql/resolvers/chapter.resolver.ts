import { Context } from '../context';
import { requireAuth } from '../context';

export const chapterResolver = {
  Query: {
    chapters: async (
      _parent: unknown,
      { novelId, page, limit }: { novelId: string; page?: number; limit?: number },
      context: Context
    ) => {
      const result = await context.dataSources.novelApi.getChapters(novelId, {
        page: page || 1,
        limit: limit || 10,
      });

      return {
        edges: result.data.map((chapter) => ({
          node: chapter,
          cursor: Buffer.from(chapter.id).toString('base64'),
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

    chapter: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      try {
        return await context.dataSources.novelApi.getChapterById(id);
      } catch {
        return null;
      }
    },

    chapterByNumber: async (_parent: unknown, { novelId, chapterNum }: { novelId: string; chapterNum: number }, context: Context) => {
      try {
        return await context.dataSources.novelApi.getChapterByNumber(novelId, chapterNum);
      } catch {
        return null;
      }
    },
  },

  Mutation: {
    createChapter: async (
      _parent: unknown,
      { novelId, input }: { novelId: string; input: { title: string; content: string; chapterNum?: number } },
      context: Context
    ) => {
      requireAuth(context);
      return context.dataSources.novelApi.createChapter(novelId, input);
    },

    updateChapter: async (
      _parent: unknown,
      { id, input }: { id: string; input: { title?: string; content?: string; chapterNum?: number } },
      context: Context
    ) => {
      requireAuth(context);
      return context.dataSources.novelApi.updateChapter(id, input);
    },

    deleteChapter: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.deleteChapter(id);
    },
  },

  Chapter: {
    novel: async (parent: { novelId: string }, _args: unknown, context: Context) => {
      try {
        return await context.dataSources.novelApi.getNovelById(parent.novelId);
      } catch {
        return null;
      }
    },
  },
};

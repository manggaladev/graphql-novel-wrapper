import { Context } from '../context';
import { requireAuth } from '../context';

export const novelResolver = {
  Query: {
    novels: async (
      _parent: unknown,
      args: {
        page?: number;
        limit?: number;
        sort?: string;
        order?: 'asc' | 'desc';
        genre?: string;
        search?: string;
        status?: 'ONGOING' | 'COMPLETED' | 'HIATUS';
      },
      context: Context
    ) => {
      const result = await context.dataSources.novelApi.getNovels({
        page: args.page || 1,
        limit: args.limit || 10,
        sort: args.sort,
        order: args.order,
        genre: args.genre,
        search: args.search,
        status: args.status,
      });

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

    novel: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      try {
        return await context.dataSources.novelApi.getNovelById(id);
      } catch {
        return null;
      }
    },

    novelBySlug: async (_parent: unknown, { slug }: { slug: string }, context: Context) => {
      try {
        return await context.dataSources.novelApi.getNovelBySlug(slug);
      } catch {
        return null;
      }
    },

    popularNovels: async (_parent: unknown, { limit }: { limit?: number }, context: Context) => {
      return context.dataSources.novelApi.getPopularNovels(limit || 10);
    },

    latestNovels: async (_parent: unknown, { limit }: { limit?: number }, context: Context) => {
      return context.dataSources.novelApi.getLatestNovels(limit || 10);
    },
  },

  Mutation: {
    createNovel: async (
      _parent: unknown,
      { input }: { input: { title: string; synopsis?: string; status?: 'ONGOING' | 'COMPLETED' | 'HIATUS'; genres?: string[]; coverUrl?: string } },
      context: Context
    ) => {
      requireAuth(context);
      return context.dataSources.novelApi.createNovel(input);
    },

    updateNovel: async (
      _parent: unknown,
      { id, input }: { id: string; input: { title?: string; synopsis?: string; status?: 'ONGOING' | 'COMPLETED' | 'HIATUS'; genres?: string[]; coverUrl?: string } },
      context: Context
    ) => {
      requireAuth(context);
      return context.dataSources.novelApi.updateNovel(id, input);
    },

    deleteNovel: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.deleteNovel(id);
    },
  },

  Novel: {
    author: async (parent: { authorId: string }, _args: unknown, context: Context) => {
      // This would need a separate endpoint or we could include author in the novel response
      // For now, return null as we need to implement a getUser endpoint
      return null;
    },
    genres: async (parent: { id: string }, _args: unknown, context: Context) => {
      // The REST API should include genres in the novel response
      return [];
    },
  },
};

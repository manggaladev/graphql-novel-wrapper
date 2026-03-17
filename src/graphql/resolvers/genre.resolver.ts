import { Context } from '../context';
import { requireAuth, requireAdmin } from '../context';

export const genreResolver = {
  Query: {
    genres: async (_parent: unknown, _args: unknown, context: Context) => {
      return context.dataSources.novelApi.getGenres();
    },

    genre: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      try {
        return await context.dataSources.novelApi.getGenreById(id);
      } catch {
        return null;
      }
    },
  },

  Mutation: {
    createGenre: async (_parent: unknown, { name }: { name: string }, context: Context) => {
      requireAdmin(context);
      return context.dataSources.novelApi.createGenre(name);
    },

    updateGenre: async (_parent: unknown, { id, name }: { id: string; name: string }, context: Context) => {
      requireAdmin(context);
      return context.dataSources.novelApi.updateGenre(id, name);
    },

    deleteGenre: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      requireAdmin(context);
      return context.dataSources.novelApi.deleteGenre(id);
    },
  },
};

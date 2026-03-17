import { Context } from '../context';
import { requireAuth } from '../context';

export const ratingResolver = {
  Mutation: {
    rateNovel: async (_parent: unknown, { novelId, score }: { novelId: string; score: number }, context: Context) => {
      requireAuth(context);

      // Validate score range
      if (score < 1 || score > 5) {
        throw new Error('Rating score must be between 1 and 5');
      }

      return context.dataSources.novelApi.rateNovel(novelId, score);
    },

    removeRating: async (_parent: unknown, { novelId }: { novelId: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.removeRating(novelId);
    },
  },

  Rating: {
    novel: async (parent: { novelId: string }, _args: unknown, context: Context) => {
      try {
        return await context.dataSources.novelApi.getNovelById(parent.novelId);
      } catch {
        return null;
      }
    },
  },
};

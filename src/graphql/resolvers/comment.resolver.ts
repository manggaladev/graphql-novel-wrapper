import { Context } from '../context';
import { requireAuth } from '../context';

export const commentResolver = {
  Query: {
    userComments: async (_parent: unknown, _args: unknown, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.getMyComments();
    },
  },

  Mutation: {
    addComment: async (_parent: unknown, { chapterId, content }: { chapterId: string; content: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.addComment(chapterId, content);
    },

    updateComment: async (_parent: unknown, { id, content }: { id: string; content: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.updateComment(id, content);
    },

    deleteComment: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.deleteComment(id);
    },
  },

  Comment: {
    chapter: async (parent: { chapterId: string }, _args: unknown, context: Context) => {
      try {
        return await context.dataSources.novelApi.getChapterById(parent.chapterId);
      } catch {
        return null;
      }
    },
  },
};

import { Context } from '../context';
import { requireAuth } from '../context';

export const commentResolver = {
  Query: {
    comments: async (
      _parent: unknown,
      { chapterId, page, limit }: { chapterId: string; page?: number; limit?: number },
      context: Context
    ) => {
      const result = await context.dataSources.novelApi.getComments(chapterId, { page, limit });

      return {
        edges: result.data.map((comment) => ({
          node: {
            ...comment,
            isLiked: context.user ? comment.likesCount > 0 : false, // Simplified, actual check would need API support
            repliesCount: 0, // Would need API support
          },
          cursor: Buffer.from(comment.id).toString('base64'),
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

    commentReplies: async (
      _parent: unknown,
      { commentId, page, limit }: { commentId: string; page?: number; limit?: number },
      context: Context
    ) => {
      const result = await context.dataSources.novelApi.getCommentReplies(commentId, { page, limit });

      return {
        edges: result.data.map((comment) => ({
          node: {
            ...comment,
            isLiked: context.user ? comment.likesCount > 0 : false,
            repliesCount: 0,
          },
          cursor: Buffer.from(comment.id).toString('base64'),
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

    userComments: async (_parent: unknown, _args: unknown, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.getMyComments();
    },
  },

  Mutation: {
    addComment: async (
      _parent: unknown,
      { chapterId, content, parentId }: { chapterId: string; content: string; parentId?: string },
      context: Context
    ) => {
      requireAuth(context);
      return context.dataSources.novelApi.addComment(chapterId, content, parentId);
    },

    updateComment: async (_parent: unknown, { id, content }: { id: string; content: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.updateComment(id, content);
    },

    deleteComment: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.deleteComment(id);
    },

    likeComment: async (_parent: unknown, { commentId }: { commentId: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.likeComment(commentId);
    },

    unlikeComment: async (_parent: unknown, { commentId }: { commentId: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.unlikeComment(commentId);
    },
  },

  Comment: {
    user: async (parent: { userId: string }, _args: unknown, context: Context) => {
      if (!parent.userId) return null;
      try {
        return await context.dataSources.novelApi.getUserProfile(parent.userId);
      } catch {
        return null;
      }
    },
    chapter: async (parent: { chapterId: string }, _args: unknown, context: Context) => {
      if (!parent.chapterId) return null;
      try {
        return await context.dataSources.novelApi.getChapterById(parent.chapterId);
      } catch {
        return null;
      }
    },
    replies: async (
      parent: { id: string },
      { page, limit }: { page?: number; limit?: number },
      context: Context
    ) => {
      const result = await context.dataSources.novelApi.getCommentReplies(parent.id, { page, limit });

      return {
        edges: result.data.map((comment) => ({
          node: comment,
          cursor: Buffer.from(comment.id).toString('base64'),
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

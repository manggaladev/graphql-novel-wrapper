/**
 * Notification Resolver
 * Handles user notifications
 */

import { Context } from '../context';
import { requireAuth } from '../context';

export const notificationResolver = {
  Query: {
    notifications: async (
      _parent: unknown,
      { page, limit, unreadOnly }: { page?: number; limit?: number; unreadOnly?: boolean },
      context: Context
    ) => {
      requireAuth(context);
      const result = await context.dataSources.novelApi.getNotifications({ page, limit, unreadOnly });

      return {
        edges: result.data.map((notification) => ({
          node: notification,
          cursor: Buffer.from(notification.id).toString('base64'),
        })),
        pageInfo: {
          hasNextPage: result.pagination.hasNext,
          hasPreviousPage: result.pagination.hasPrev,
          startCursor: result.data[0] ? Buffer.from(result.data[0].id).toString('base64') : null,
          endCursor: result.data[result.data.length - 1] ? Buffer.from(result.data[result.data.length - 1].id).toString('base64') : null,
        },
        totalCount: result.pagination.total,
        unreadCount: result.unreadCount,
      };
    },
  },

  Mutation: {
    markNotificationAsRead: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.markNotificationAsRead(id);
    },

    markAllNotificationsAsRead: async (_parent: unknown, _args: unknown, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.markAllNotificationsAsRead();
    },

    deleteNotification: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.deleteNotification(id);
    },

    clearAllNotifications: async (_parent: unknown, _args: unknown, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.clearAllNotifications();
    },
  },
};

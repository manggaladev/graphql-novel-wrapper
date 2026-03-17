import { Context, requireAuth } from '../context';

export const authResolver = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: Context) => {
      requireAuth(context);
      return context.dataSources.novelApi.getMe();
    },
  },

  Mutation: {
    register: async (_parent: unknown, { input }: { input: { username: string; email: string; password: string } }, context: Context) => {
      return context.dataSources.novelApi.register(input);
    },

    login: async (_parent: unknown, { input }: { input: { email: string; password: string } }, context: Context) => {
      return context.dataSources.novelApi.login(input);
    },

    refreshToken: async (_parent: unknown, { refreshToken }: { refreshToken: string }, context: Context) => {
      return context.dataSources.novelApi.refreshToken(refreshToken);
    },

    logout: async (_parent: unknown, _args: unknown, context: Context) => {
      // Note: In a real implementation, you would need to pass the refresh token
      // For now, we'll return true as the REST API handles this
      return true;
    },
  },
};

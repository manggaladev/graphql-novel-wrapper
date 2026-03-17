import { NovelAPI } from '../datasources';

export interface Context {
  dataSources: {
    novelApi: NovelAPI;
  };
  user?: {
    id: string;
    email: string;
    username: string;
    role: 'ADMIN' | 'USER';
  };
  token?: string;
}

// Helper function to check if user is authenticated
export const requireAuth = (context: Context): void => {
  if (!context.user) {
    throw new Error('Authentication required. Please login.');
  }
};

// Helper function to check if user is admin
export const requireAdmin = (context: Context): void => {
  requireAuth(context);
  if (context.user!.role !== 'ADMIN') {
    throw new Error('Admin access required.');
  }
};

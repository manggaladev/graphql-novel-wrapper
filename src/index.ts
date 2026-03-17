import express from 'express';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import cors from 'cors';
import { config } from './config';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { NovelAPI } from './datasources';
import { buildContext, Context } from './middleware/auth';
import { formatError } from './utils/errors';

// Create Express app and HTTP server
const app = express();
const httpServer = createServer(app);

// Create WebSocket server for subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

// Create Apollo Server with subscription support
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [
    // Proper shutdown for the HTTP server
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Proper shutdown for the WebSocket server
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await wsServer.close();
          },
        };
      },
    },
  ],
  formatError: (error) => {
    // Log errors for debugging
    console.error('GraphQL Error:', error);
    return formatError(error);
  },
});

// Start the server
async function startServer() {
  await server.start();

  // Setup WebSocket subscription server
  useServer(
    {
      schema: undefined as unknown as Parameters<typeof useServer>[0]['schema'], // Schema will be built by Apollo
      typeDefs,
      resolvers,
      context: async (ctx) => {
        // Build context from WebSocket connection params
        const token = ctx.connectionParams?.authorization as string | undefined;
        
        let user: Context['user'] = undefined;
        
        if (token) {
          // Parse JWT token
          const parts = token.split(' ');
          const actualToken = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : token;
          
          try {
            const base64Payload = actualToken.split('.')[1];
            if (base64Payload) {
              const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf-8'));
              user = {
                id: payload.id || payload.sub,
                email: payload.email,
                username: payload.username,
                role: payload.role || 'USER',
              };
            }
          } catch {
            // Invalid token, continue without user
          }
        }
        
        const novelApi = new NovelAPI(token);
        
        return {
          dataSources: {
            novelApi,
          },
          user,
          token,
        };
      },
    },
    wsServer
  );

  // Apply middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: '*',
      credentials: true,
    }),
    express.json({ limit: '10mb' }),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Build context from request
        const { user, token } = await buildContext(req);

        // Create data source instance with token
        const novelApi = new NovelAPI(token);

        return {
          dataSources: {
            novelApi,
          },
          user,
          token,
        };
      },
    })
  );

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      graphql: '/graphql',
      subscriptions: 'ws://localhost:' + config.port + '/graphql',
      restApiUrl: config.restApiUrl,
    });
  });

  // Root endpoint
  app.get('/', (_req, res) => {
    res.json({
      name: 'GraphQL Novel Wrapper',
      version: '3.0.0',
      description: 'GraphQL wrapper for novel-api REST API',
      graphql: '/graphql',
      health: '/health',
      subscriptions: 'ws://localhost:' + config.port + '/graphql',
      features: {
        auth: 'register, login, refreshToken, logout, me',
        novels: 'novels, novel, novelBySlug, popularNovels, latestNovels, trendingNovels, similarNovels, recommendations',
        chapters: 'chapters, chapter, chapterByNumber',
        genres: 'genres, genre',
        comments: 'comments, commentReplies, myComments (nested with likes)',
        follows: 'followers, following, followStatus',
        readingLists: 'myReadingLists, readingList',
        notifications: 'notifications',
        bookmarks: 'userBookmarks',
        ratings: 'rateNovel, removeRating',
        history: 'userReadingHistory',
        progress: 'readingProgress, updateReadingProgress (NEW v3.0.0)',
        reports: 'reportContent (NEW v3.0.0)',
        subscriptions: 'novelUpdated, chapterPublished, commentAdded, notificationReceived (NEW v3.0.0)',
      },
    });
  });

  // Start listening
  httpServer.listen(config.port, () => {
    console.log(`🚀 GraphQL Server running at http://localhost:${config.port}/graphql`);
    console.log(`🔌 WebSocket Subscriptions at ws://localhost:${config.port}/graphql`);
    console.log(`📊 Health check at http://localhost:${config.port}/health`);
    console.log(`📚 REST API URL: ${config.restApiUrl}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

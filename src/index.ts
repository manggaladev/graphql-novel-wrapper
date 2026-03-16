import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { config } from './config';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { NovelAPI } from './datasources';
import { buildContext, Context } from './middleware/auth';

// Create Express app
const app = express();

// Create Apollo Server
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  introspection: true, // Enable introspection for development
});

// Start the server
async function startServer() {
  await server.start();

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
      restApiUrl: config.restApiUrl,
    });
  });

  // Root endpoint
  app.get('/', (_req, res) => {
    res.json({
      name: 'GraphQL Novel Wrapper',
      version: '1.0.0',
      description: 'GraphQL wrapper for novel-api REST API',
      graphql: '/graphql',
      health: '/health',
      endpoints: {
        auth: 'register, login, refreshToken, logout, me',
        novels: 'novels, novel, novelBySlug, popularNovels, latestNovels, createNovel, updateNovel, deleteNovel',
        chapters: 'chapters, chapter, chapterByNumber, createChapter, updateChapter, deleteChapter',
        genres: 'genres, genre, createGenre, updateGenre, deleteGenre',
        bookmarks: 'userBookmarks, addBookmark, removeBookmark',
        comments: 'userComments, addComment, updateComment, deleteComment',
        ratings: 'rateNovel, removeRating',
        history: 'userReadingHistory',
      },
    });
  });

  // Start listening
  app.listen(config.port, () => {
    console.log(`🚀 GraphQL Server running at http://localhost:${config.port}/graphql`);
    console.log(`📊 Health check at http://localhost:${config.port}/health`);
    console.log(`📚 REST API URL: ${config.restApiUrl}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

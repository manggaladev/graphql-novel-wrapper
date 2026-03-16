import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/graphql/schema/*.graphql',
  generates: {
    './src/types/generated.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        useIndexSignature: true,
        contextType: '../graphql/context#Context',
        mappers: {
          User: '../datasources#User',
          Novel: '../datasources#Novel',
          Chapter: '../datasources#Chapter',
          Genre: '../datasources#Genre',
          Comment: '../datasources#Comment',
          Rating: '../datasources#Rating',
          Bookmark: '../datasources#Bookmark',
          ReadingHistory: '../datasources#ReadingHistory',
        },
      },
    },
  },
};

export default config;

import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { GraphQLScalarType, Kind } from 'graphql';

// Read all schema files
const readSchema = (filename: string): string => {
  return readFileSync(join(__dirname, filename), 'utf-8');
};

// Custom JSON scalar
const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON scalar type',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value);
      } catch {
        return null;
      }
    }
    return null;
  },
});

// Combine all typeDefs
export const typeDefs = gql`
  ${readSchema('common.graphql')}
  ${readSchema('user.graphql')}
  ${readSchema('novel.graphql')}
  ${readSchema('chapter.graphql')}
  ${readSchema('genre.graphql')}
  ${readSchema('comment.graphql')}
  ${readSchema('rating.graphql')}
  ${readSchema('bookmark.graphql')}
  ${readSchema('history.graphql')}
  ${readSchema('connection.graphql')}
  ${readSchema('follow.graphql')}
  ${readSchema('readingList.graphql')}
  ${readSchema('notification.graphql')}
  ${readSchema('root.graphql')}
  ${readSchema('mutation.graphql')}
  ${readSchema('subscription.graphql')}
`;

export const resolvers = {
  JSON: JSONScalar,
};

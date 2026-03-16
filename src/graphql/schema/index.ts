import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';

// Read all schema files
const readSchema = (filename: string): string => {
  return readFileSync(join(__dirname, filename), 'utf-8');
};

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
  ${readSchema('root.graphql')}
  ${readSchema('mutation.graphql')}
`;

import { healthResolver } from './health.resolver';
import { authResolver } from './auth.resolver';
import { novelResolver } from './novel.resolver';
import { chapterResolver } from './chapter.resolver';
import { genreResolver } from './genre.resolver';
import { bookmarkResolver } from './bookmark.resolver';
import { commentResolver } from './comment.resolver';
import { ratingResolver } from './rating.resolver';
import { historyResolver } from './history.resolver';

// Combine all resolvers
export const resolvers = [
  healthResolver,
  authResolver,
  novelResolver,
  chapterResolver,
  genreResolver,
  bookmarkResolver,
  commentResolver,
  ratingResolver,
  historyResolver,
];

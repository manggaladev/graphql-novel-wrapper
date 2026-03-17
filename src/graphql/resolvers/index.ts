import { healthResolver } from './health.resolver';
import { authResolver } from './auth.resolver';
import { novelResolver } from './novel.resolver';
import { chapterResolver } from './chapter.resolver';
import { genreResolver } from './genre.resolver';
import { bookmarkResolver } from './bookmark.resolver';
import { commentResolver } from './comment.resolver';
import { ratingResolver } from './rating.resolver';
import { historyResolver } from './history.resolver';
import { followResolver } from './follow.resolver';
import { readingListResolver } from './readingList.resolver';
import { notificationResolver } from './notification.resolver';
import { userResolver } from './user.resolver';
import { subscriptionResolver } from './subscription.resolver';
import { resolvers as schemaResolvers } from '../schema';

// Combine all resolvers
export const resolvers = [
  schemaResolvers,
  healthResolver,
  authResolver,
  novelResolver,
  chapterResolver,
  genreResolver,
  bookmarkResolver,
  commentResolver,
  ratingResolver,
  historyResolver,
  followResolver,
  readingListResolver,
  notificationResolver,
  userResolver,
  subscriptionResolver,
];

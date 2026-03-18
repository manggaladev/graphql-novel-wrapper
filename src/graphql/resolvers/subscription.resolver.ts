/**
 * Subscription Resolver
 * Implements real-time GraphQL subscriptions using PubSub
 */

import { Context } from '../context';

/**
 * Simple PubSub implementation for managing subscriptions
 * In production, you might want to use Redis PubSub for distributed systems
 */
class PubSub {
  private subscriptions: Map<string, Set<(data: unknown) => void>> = new Map();
  private subscriptionId = 0;

  /**
   * Publish an event to all subscribers
   */
  publish(triggerName: string, payload: unknown): boolean {
    const subscribers = this.subscriptions.get(triggerName);
    if (!subscribers || subscribers.size === 0) {
      return false;
    }

    subscribers.forEach((callback) => {
      try {
        callback(payload);
      } catch (error) {
        console.error(`Error in subscriber for ${triggerName}:`, error);
      }
    });

    return true;
  }

  /**
   * Subscribe to an event
   * Returns an async iterator that yields payloads
   */
  asyncIterator<T>(triggerName: string): AsyncIterator<T> {
    const id = ++this.subscriptionId;
    let resolver: (value: IteratorResult<T>) => void;
    let rejecter: (error: Error) => void;
    const queue: T[] = [];
    let done = false;

    const callback = (data: unknown) => {
      if (done) return;

      if (resolver) {
        resolver({ value: data as T, done: false });
        resolver = undefined as unknown as (value: IteratorResult<T>) => void;
        rejecter = undefined as unknown as (error: Error) => void;
      } else {
        queue.push(data as T);
      }
    };

    // Add subscriber
    if (!this.subscriptions.has(triggerName)) {
      this.subscriptions.set(triggerName, new Set());
    }
    this.subscriptions.get(triggerName)!.add(callback);

    return {
      next: async (): Promise<IteratorResult<T>> => {
        if (queue.length > 0) {
          return { value: queue.shift()!, done: false };
        }

        if (done) {
          return { value: undefined as unknown as T, done: true };
        }

        return new Promise<IteratorResult<T>>((resolve, reject) => {
          resolver = resolve;
          rejecter = reject;
        });
      },
      return: async (): Promise<IteratorResult<T>> => {
        done = true;
        // Remove subscriber
        const subscribers = this.subscriptions.get(triggerName);
        if (subscribers) {
          subscribers.delete(callback);
        }
        return { value: undefined as unknown as T, done: true };
      },
      throw: async (error: Error): Promise<IteratorResult<T>> => {
        done = true;
        // Remove subscriber
        const subscribers = this.subscriptions.get(triggerName);
        if (subscribers) {
          subscribers.delete(callback);
        }
        if (rejecter) {
          rejecter(error);
        }
        throw error;
      },
    };
  }

  /**
   * Get number of subscribers for a trigger
   */
  subscriberCount(triggerName: string): number {
    return this.subscriptions.get(triggerName)?.size || 0;
  }
}

// Singleton PubSub instance
export const pubsub = new PubSub();

// Trigger names for subscriptions
export const SUBSCRIPTION_TRIGGERS = {
  NOVEL_UPDATED: 'NOVEL_UPDATED',
  CHAPTER_PUBLISHED: 'CHAPTER_PUBLISHED',
  COMMENT_ADDED: 'COMMENT_ADDED',
  NOTIFICATION_RECEIVED: 'NOTIFICATION_RECEIVED',
} as const;

/**
 * Helper functions to publish events
 */
export const publishNovelUpdate = (
  novelId: string,
  updateType: 'INFO_UPDATED' | 'STATUS_CHANGED' | 'NEW_CHAPTER' | 'RATING_UPDATED',
  novel: unknown,
  changedFields?: string[]
) => {
  pubsub.publish(`${SUBSCRIPTION_TRIGGERS.NOVEL_UPDATED}_${novelId}`, {
    novelUpdated: {
      novel,
      updateType,
      changedFields: changedFields || [],
      timestamp: new Date().toISOString(),
    },
  });
};

export const publishChapter = (novelId: string, chapter: unknown) => {
  pubsub.publish(`${SUBSCRIPTION_TRIGGERS.CHAPTER_PUBLISHED}_${novelId}`, {
    chapterPublished: chapter,
  });
};

export const publishComment = (chapterId: string, comment: unknown) => {
  pubsub.publish(`${SUBSCRIPTION_TRIGGERS.COMMENT_ADDED}_${chapterId}`, {
    commentAdded: comment,
  });
};

export const publishNotification = (userId: string, notification: unknown) => {
  pubsub.publish(`${SUBSCRIPTION_TRIGGERS.NOTIFICATION_RECEIVED}_${userId}`, {
    notificationReceived: notification,
  });
};

/**
 * Subscription Resolver
 */
export const subscriptionResolver = {
  Subscription: {
    /**
     * Subscribe to novel updates
     */
    novelUpdated: {
      subscribe: async (
        _parent: unknown,
        { novelId }: { novelId: string },
        _context: Context
      ) => {
        // In a real implementation, you might want to check if the novel exists
        // and if the user has permission to subscribe
        return pubsub.asyncIterator(`${SUBSCRIPTION_TRIGGERS.NOVEL_UPDATED}_${novelId}`);
      },
      resolve: (payload: { novelUpdated: unknown }) => payload.novelUpdated,
    },

    /**
     * Subscribe to new chapter publications
     */
    chapterPublished: {
      subscribe: async (
        _parent: unknown,
        { novelId }: { novelId: string },
        _context: Context
      ) => {
        return pubsub.asyncIterator(`${SUBSCRIPTION_TRIGGERS.CHAPTER_PUBLISHED}_${novelId}`);
      },
      resolve: (payload: { chapterPublished: unknown }) => payload.chapterPublished,
    },

    /**
     * Subscribe to new comments on a chapter
     */
    commentAdded: {
      subscribe: async (
        _parent: unknown,
        { chapterId }: { chapterId: string },
        _context: Context
      ) => {
        return pubsub.asyncIterator(`${SUBSCRIPTION_TRIGGERS.COMMENT_ADDED}_${chapterId}`);
      },
      resolve: (payload: { commentAdded: unknown }) => payload.commentAdded,
    },

    /**
     * Subscribe to user notifications
     */
    notificationReceived: {
      subscribe: async (
        _parent: unknown,
        { userId }: { userId: string },
        context: Context
      ) => {
        // Only allow users to subscribe to their own notifications
        if (context.user?.id !== userId) {
          throw new Error('You can only subscribe to your own notifications');
        }
        return pubsub.asyncIterator(`${SUBSCRIPTION_TRIGGERS.NOTIFICATION_RECEIVED}_${userId}`);
      },
      resolve: (payload: { notificationReceived: unknown }) => payload.notificationReceived,
    },
  },
};

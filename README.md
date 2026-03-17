# GraphQL Novel Wrapper

GraphQL wrapper untuk [novel-api](https://github.com/manggaladev/novel-api) REST API menggunakan Apollo Server.

## 📖 Deskripsi

Proyek ini adalah **GraphQL wrapper** yang dibangun di atas REST API `novel-api`. Tujuan utamanya adalah untuk pembelajaran GraphQL, bukan menggantikan REST API. Server GraphQL menerima query/mutation, kemudian memanggil endpoint REST API di belakang layar.

## ✨ Features

### Core Features
- 📚 **Novel Management** - CRUD dengan cover upload
- 📖 **Chapter Management** - CRUD dengan auto-numbering
- 🏷️ **Genre Management** - Admin only
- 🔖 **Bookmarks** - Save favorite novels
- ⭐ **Ratings** - 1-5 rating dengan auto-calculated average
- 📜 **Reading History** - Auto-recorded

### User Interactions
- 💬 **Nested Comments** - Reply ke komentar dengan threading
- ❤️ **Comment Likes** - Like/unlike comments
- 👥 **Follow System** - Follow your favorite authors
- 📋 **Reading Lists** - Create custom reading collections

### Real-time
- 🔔 **Notifications** - Notification system

### Technical
- 🔄 **JWT Authentication** - Access & Refresh tokens
- 📄 **Pagination** - Connection pattern (edges, nodes, pageInfo)
- 🔍 **Search** - Search novels & users
- 📊 **TypeScript** - Full type safety

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| Runtime | Bun / Node.js |
| Framework | Apollo Server 4 + Express |
| Language | TypeScript |
| HTTP Client | Axios |
| Codegen | GraphQL Code Generator |

## 🚀 Getting Started

### Prerequisites

- Bun or Node.js 18+
- Running `novel-api` REST API

### Installation

```bash
# Clone
git clone https://github.com/manggaladev/graphql-novel-wrapper.git
cd graphql-novel-wrapper

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env and set REST_API_URL to your novel-api URL

# Start development
bun run dev
```

Server akan jalan di `http://localhost:4001/graphql`

## 📡 Schema Overview

### Queries

```graphql
type Query {
  # Health
  health: HealthStatus!

  # Novels
  novels(page: Int, limit: Int, sort: String, order: SortOrder, genre: String, search: String, status: NovelStatus): NovelConnection!
  novel(id: ID!): Novel
  novelBySlug(slug: String!): Novel
  popularNovels(limit: Int): [Novel!]!
  latestNovels(limit: Int): [Novel!]!

  # Chapters
  chapters(novelId: ID!, page: Int, limit: Int): ChapterConnection!
  chapter(id: ID!): Chapter
  chapterByNumber(novelId: ID!, chapterNum: Int!): Chapter

  # Genres
  genres: [Genre!]!
  genre(id: ID!): Genre

  # Users
  me: User
  user(id: ID!): User
  userNovels(id: ID!, page: Int, limit: Int): NovelConnection!

  # Comments
  comments(chapterId: ID!, page: Int, limit: Int): CommentConnection!
  commentReplies(commentId: ID!, page: Int, limit: Int): CommentConnection!
  myComments: [Comment!]!

  # Follows
  followers(userId: ID!, page: Int, limit: Int): UserConnection!
  following(userId: ID!, page: Int, limit: Int): UserConnection!
  followStatus(userId: ID!): FollowStatus!

  # Reading Lists
  myReadingLists: [ReadingList!]!
  readingList(id: ID!, page: Int, limit: Int): ReadingList

  # Notifications
  notifications(page: Int, limit: Int, unreadOnly: Boolean): NotificationConnection!

  # Bookmarks & History
  userBookmarks(page: Int, limit: Int): BookmarkConnection!
  userReadingHistory(page: Int, limit: Int): ReadingHistoryConnection!
}
```

### Mutations

```graphql
type Mutation {
  # Auth
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  refreshToken(refreshToken: String!): AuthPayload!
  logout: Boolean!

  # Novels
  createNovel(input: CreateNovelInput!): Novel!
  updateNovel(id: ID!, input: UpdateNovelInput!): Novel!
  deleteNovel(id: ID!): Boolean!

  # Chapters
  createChapter(novelId: ID!, input: CreateChapterInput!): Chapter!
  updateChapter(id: ID!, input: UpdateChapterInput!): Chapter!
  deleteChapter(id: ID!): Boolean!

  # Comments
  addComment(chapterId: ID!, content: String!, parentId: ID): Comment!
  updateComment(id: ID!, content: String!): Comment!
  deleteComment(id: ID!): Boolean!
  likeComment(commentId: ID!): Boolean!
  unlikeComment(commentId: ID!): Boolean!

  # Follows
  followUser(userId: ID!): Boolean!
  unfollowUser(userId: ID!): Boolean!

  # Reading Lists
  createReadingList(input: CreateReadingListInput!): ReadingList!
  updateReadingList(id: ID!, input: UpdateReadingListInput!): ReadingList!
  deleteReadingList(id: ID!): Boolean!
  addNovelToReadingList(listId: ID!, novelId: ID!): Boolean!
  removeNovelFromReadingList(listId: ID!, novelId: ID!): Boolean!

  # Notifications
  markNotificationAsRead(id: ID!): Boolean!
  markAllNotificationsAsRead: Boolean!
  clearAllNotifications: Boolean!

  # Bookmarks
  addBookmark(novelId: ID!): Bookmark!
  removeBookmark(novelId: ID!): Boolean!

  # Ratings
  rateNovel(novelId: ID!, score: Int!): Rating!
  removeRating(novelId: ID!): Boolean!
}
```

## 📝 Example Queries

### Login

```graphql
mutation {
  login(input: { email: "user@example.com", password: "password123" }) {
    accessToken
    refreshToken
    user {
      id
      username
      email
      role
    }
  }
}
```

### Get Novels with Pagination

```graphql
query {
  novels(page: 1, limit: 10, sort: "createdAt", order: desc) {
    edges {
      node {
        id
        title
        slug
        synopsis
        status
        averageRating
        totalChapters
        viewsCount
        author {
          id
          username
        }
        genres {
          id
          name
          slug
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    totalCount
  }
}
```

### Get Novel with Chapters

```graphql
query {
  novel(id: "novel-uuid") {
    id
    title
    synopsis
    chapters(page: 1, limit: 20) {
      edges {
        node {
          id
          title
          chapterNum
          viewsCount
          publishedAt
        }
      }
      totalCount
    }
  }
}
```

### Nested Comments with Replies

```graphql
query {
  comments(chapterId: "chapter-uuid", page: 1, limit: 20) {
    edges {
      node {
        id
        content
        likesCount
        user {
          username
          avatar
        }
        replies(page: 1, limit: 5) {
          edges {
            node {
              id
              content
              user {
                username
              }
            }
          }
        }
      }
    }
  }
}
```

### Follow User

```graphql
mutation {
  followUser(userId: "user-uuid")
}
```

### Create Reading List

```graphql
mutation {
  createReadingList(input: {
    name: "My Favorites"
    description: "Novels I love"
    isPublic: true
  }) {
    id
    name
    novelCount
  }
}
```

### Add Comment with Reply

```graphql
# Add top-level comment
mutation {
  addComment(chapterId: "chapter-uuid", content: "Great chapter!") {
    id
    content
    likesCount
  }
}

# Reply to comment
mutation {
  addComment(
    chapterId: "chapter-uuid"
    content: "I agree!"
    parentId: "parent-comment-uuid"
  ) {
    id
    content
    parentId
  }
}
```

## 📁 Project Structure

```
graphql-novel-wrapper/
├── src/
│   ├── config/
│   │   └── index.ts              # Environment config
│   ├── datasources/
│   │   ├── index.ts
│   │   └── novel-api.ts          # REST API client
│   ├── graphql/
│   │   ├── schema/
│   │   │   ├── index.ts          # Combine all schemas
│   │   │   ├── novel.graphql
│   │   │   ├── chapter.graphql
│   │   │   ├── user.graphql
│   │   │   ├── comment.graphql
│   │   │   ├── follow.graphql
│   │   │   ├── readingList.graphql
│   │   │   ├── notification.graphql
│   │   │   └── ...
│   │   ├── resolvers/
│   │   │   ├── index.ts          # Combine all resolvers
│   │   │   ├── novel.resolver.ts
│   │   │   ├── chapter.resolver.ts
│   │   │   ├── comment.resolver.ts
│   │   │   ├── follow.resolver.ts
│   │   │   ├── readingList.resolver.ts
│   │   │   ├── notification.resolver.ts
│   │   │   └── ...
│   │   └── context.ts            # GraphQL context
│   ├── middleware/
│   │   └── auth.ts               # JWT extraction
│   └── index.ts                  # Server entry point
├── codegen.ts                    # GraphQL Code Generator config
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Authentication

GraphQL wrapper meneruskan JWT token dari client ke REST API:

1. Client mengirim token di header `Authorization: Bearer <token>`
2. Server GraphQL mengekstrak token dari header
3. Token diteruskan ke REST API saat memanggil endpoint yang memerlukan autentikasi

## 🔧 Environment Variables

```env
# REST API URL (required)
REST_API_URL=http://localhost:3000/api

# Server port
PORT=4001
```

## 🆕 What's New in v2.0.0

- 👥 **Follow System** - Follow/unfollow authors
- 💬 **Nested Comments** - Reply to comments with threading
- ❤️ **Comment Likes** - Like/unlike comments
- 📋 **Reading Lists** - Create custom collections
- 🔔 **Notifications** - Notification queries and mutations
- 📝 **User Profiles** - Profile endpoints with stats
- 🔄 **Updated Types** - Synced with novel-api v2.0.0

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

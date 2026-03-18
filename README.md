# GraphQL Novel Wrapper

GraphQL wrapper for [novel-api](https://github.com/manggaladev/novel-api) REST API using Apollo Server.

## 📖 Description

This project is a **GraphQL wrapper** built on top of the `novel-api` REST API. Its primary purpose is for learning GraphQL, not replacing the REST API. The GraphQL server receives queries/mutations, then calls REST API endpoints behind the scenes.

## ✨ Features

### Core Features
- 📚 **Novel Management** - CRUD with cover upload
- 📖 **Chapter Management** - CRUD with auto-numbering
- 🏷️ **Genre Management** - Admin only
- 🔖 **Bookmarks** - Save favorite novels
- ⭐ **Ratings** - 1-5 rating with auto-calculated average
- 📜 **Reading History** - Auto-recorded
- 💬 **Nested Comments** - Reply to comments with threading
- ❤️ **Comment Likes** - Like/unlike comments
- 👥 **Follow System** - Follow your favorite authors
- 📋 **Reading Lists** - Create custom reading collections

### Real-time
- 🔔 **Notifications** - Notification system
- 🔌 **GraphQL Subscriptions** - Real-time updates via WebSocket

### Technical
- 🔄 **JWT Authentication** - Access & Refresh tokens
- 📄 **Pagination** - Connection pattern (edges, nodes, pageInfo)
- 🔍 **Search** - Search novels & users
- 📊 **TypeScript** - Full type safety
- 🚀 **In-Memory Caching** - Cache for repeated queries with 5-minute TTL

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| Runtime | Bun / Node.js |
| Framework | Apollo Server 4 |
| Language | TypeScript |
| HTTP Client | Axios |
| Code Generation | GraphQL Code Generator |

## 📁 Project Structure

```
graphql-novel-wrapper/
├── src/
│   ├── config/
│   │   └── index.ts              # Environment configuration
│   ├── datasources/
│   │   └── novel-api.ts          # Class to call REST API
│   ├── graphql/
│   │   ├── schema/
│   │   │   └── *.graphql         # GraphQL type definitions
│   │   ├── resolvers/
│   │   │   └── *.resolver.ts     # GraphQL resolvers
│   │   └── context.ts            # Context for authentication
│   ├── middleware/
│   │   └── auth.ts               # Middleware to extract token
│   └── index.ts                  # Entry point
├── codegen.ts                    # GraphQL Code Generator config
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/manggaladev/graphql-novel-wrapper.git
cd graphql-novel-wrapper
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Setup Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
REST_API_URL=http://localhost:4000/api
PORT=4001
```

### 4. Run Server

```bash
bun run dev
```

Server will run at `http://localhost:4001/graphql`

## 🔐 Authentication

GraphQL wrapper forwards JWT token from client to REST API:

1. Client sends token in header `Authorization: Bearer <token>`
2. GraphQL server extracts token from header
3. Token is forwarded to REST API when calling authenticated endpoints

## 📚 Example Queries

### Auth

**Register**
```graphql
mutation {
  register(input: {
    username: "testuser"
    email: "test@example.com"
    password: "password123"
  }) {
    accessToken
    refreshToken
    user {
      id
      username
      email
    }
  }
}
```

**Login**
```graphql
mutation {
  login(input: {
    email: "test@example.com"
    password: "password123"
  }) {
    accessToken
    refreshToken
  }
}
```

### Novels

**Get All Novels**
```graphql
query {
  novels(page: 1, limit: 10) {
    edges {
      node {
        id
        title
        slug
        synopsis
        averageRating
      }
    }
    totalCount
  }
}
```

**Create Novel** (requires token)
```graphql
mutation {
  createNovel(input: {
    title: "New Novel"
    synopsis: "Description"
    status: ONGOING
  }) {
    id
    title
    slug
  }
}
```

### Chapters

**Get Chapters by Novel**
```graphql
query {
  chapters(novelId: "novel-uuid", page: 1, limit: 10) {
    edges {
      node {
        id
        title
        chapterNum
      }
    }
    totalCount
  }
}
```

## 🔧 Development

### GraphQL Code Generator

Generate TypeScript types from schema:

```bash
bun run codegen
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

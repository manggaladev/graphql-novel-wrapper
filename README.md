# 🔮 GraphQL Novel Wrapper

[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Apollo](https://img.shields.io/badge/Apollo%20Server-4-311C87?style=flat-square&logo=apollographql)](https://apollographql.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)](https://github.com/manggaladev/graphql-novel-wrapper)

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

### GraphQL Features
- 🔍 **Queries** - Fetch data with flexible queries
- ✏️ **Mutations** - Create, update, delete operations
- 🔗 **Subscriptions** - Real-time updates via WebSocket
- 📝 **Type Safety** - Auto-generated TypeScript types

## 🛠️ Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **GraphQL Server**: Apollo Server 4
- **GraphQL Tools**: @graphql-tools/schema
- **WebSocket**: graphql-ws

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/manggaladev/graphql-novel-wrapper.git
cd graphql-novel-wrapper

# Install dependencies
bun install

# Copy environment file
cp .env.example .env

# Start the server
bun run dev
```

## 🚀 Usage

### Start Server

```bash
bun run dev
```

Server runs at `http://localhost:4000`

### Example Queries

```graphql
# Get all novels
query {
  novels(page: 1, limit: 10) {
    id
    title
    author
    description
    chapters {
      id
      title
    }
  }
}

# Create a novel (requires auth)
mutation {
  createNovel(input: {
    title: "My Novel"
    description: "A great story"
    genreId: 1
  }) {
    id
    title
  }
}
```

## 📁 Project Structure

```
graphql-novel-wrapper/
├── src/
│   ├── index.ts          # Entry point
│   ├── schema/           # GraphQL schema definitions
│   ├── resolvers/        # GraphQL resolvers
│   └── services/         # REST API clients
├── codegen.ts            # GraphQL Code Generator config
├── package.json
├── tsconfig.json
└── README.md
```

## 📄 License

[MIT License](LICENSE) © 2026 manggaladev

## 🔗 Links

- [GitHub Repository](https://github.com/manggaladev/graphql-novel-wrapper)
- [novel-api](https://github.com/manggaladev/novel-api) - The underlying REST API
- [Issues](https://github.com/manggaladev/graphql-novel-wrapper/issues)

<div align="center">

# 🔮 GraphQL Novel Wrapper

**GraphQL wrapper for novel-api REST API using Apollo Server**

[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Apollo](https://img.shields.io/badge/Apollo%20Server-4-311C87?style=for-the-badge&logo=apollographql)](https://apollographql.com)
[![Bun](https://img.shields.io/badge/Bun-1.0-black?style=for-the-badge)](https://bun.sh)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 🎯 Overview

This is a **GraphQL wrapper** built on top of [novel-api](https://github.com/manggaladev/novel-api) REST API. Perfect for learning GraphQL concepts!

### Why GraphQL?

| REST | GraphQL |
|------|---------|
| Multiple endpoints | Single endpoint |
| Over/under fetching | Fetch exactly what you need |
| Multiple requests | Single request |
| No type safety | Strongly typed schema |

## ✨ Features

### Queries
```graphql
query {
  novels(page: 1, limit: 10) {
    id
    title
    author
    description
    chapters { id title }
  }
}
```

### Mutations
```graphql
mutation {
  createNovel(input: {
    title: "My Novel"
    description: "A great story"
  }) {
    id
    title
  }
}
```

### Subscriptions
```graphql
subscription {
  onNovelCreated {
    id
    title
    author
  }
}
```

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/manggaladev/graphql-novel-wrapper.git
cd graphql-novel-wrapper

# Install
bun install

# Configure
cp .env.example .env

# Run
bun run dev
```

GraphQL Playground: `http://localhost:4001/graphql`

## 🔧 Environment

```env
REST_API_URL=http://localhost:4000/api
PORT=4001
```

## 📚 Schema

### Types
- `User` - User profile
- `Novel` - Novel with chapters
- `Chapter` - Novel chapter
- `Genre` - Novel genre
- `Comment` - Comments with nesting

### Operations
| Query | Mutation | Subscription |
|-------|----------|--------------|
| novels | createNovel | onNovelCreated |
| novel | updateNovel | onChapterAdded |
| chapters | deleteNovel | onCommentAdded |
| me | login | - |

## 🏗️ Structure

```
graphql-novel-wrapper/
├── src/
│   ├── index.ts          # Entry point
│   ├── graphql/
│   │   ├── schema/       # GraphQL schemas
│   │   └── resolvers/    # Resolvers
│   ├── datasources/      # REST API clients
│   └── middleware/       # Auth middleware
└── package.json
```

## 🔗 Related

- [novel-api](https://github.com/manggaladev/novel-api) - The REST API

## 🤝 Contributing

Contributions welcome!

## 📄 License

[MIT License](LICENSE)

---

<div align="center">

**[⬆ Back to Top](#-graphql-novel-wrapper)**

Made with ❤️ by [manggaladev](https://github.com/manggaladev)

</div>

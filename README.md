# GraphQL Novel Wrapper

GraphQL wrapper untuk [novel-api](https://github.com/manggaladev/novel-api) REST API menggunakan Apollo Server.

## 📖 Deskripsi

Proyek ini adalah **GraphQL wrapper** yang dibangun di atas REST API `novel-api`. Tujuan utamanya adalah untuk pembelajaran GraphQL, bukan menggantikan REST API. Server GraphQL menerima query/mutation, kemudian memanggil endpoint REST API di belakang layar.

## 🛠️ Teknologi

- **Apollo Server 4** dengan Express integration
- **TypeScript** untuk type safety
- **Axios** untuk HTTP requests ke REST API
- **GraphQL Code Generator** (opsional) untuk generate TypeScript types

## 📁 Struktur Proyek

```
graphql-novel-wrapper/
├── src/
│   ├── config/
│   │   └── index.ts              # Konfigurasi environment
│   ├── datasources/
│   │   ├── novel-api.ts          # Class untuk memanggil REST API
│   │   └── index.ts
│   ├── graphql/
│   │   ├── schema/
│   │   │   ├── index.ts          # Gabungan semua typeDefs
│   │   │   ├── novel.graphql
│   │   │   ├── chapter.graphql
│   │   │   ├── user.graphql
│   │   │   └── ...
│   │   ├── resolvers/
│   │   │   ├── index.ts          # Gabungan semua resolvers
│   │   │   ├── novel.resolver.ts
│   │   │   ├── chapter.resolver.ts
│   │   │   └── ...
│   │   └── context.ts            # Context untuk autentikasi
│   ├── middleware/
│   │   └── auth.ts               # Middleware untuk extract token
│   └── index.ts                  # Entry point
├── codegen.ts                    # GraphQL Code Generator config
├── .env.example
├── package.json
└── README.md
```

## 🚀 Cara Menjalankan

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

Edit `.env` sesuai konfigurasi:

```env
REST_API_URL=http://localhost:4000/api
PORT=4001
```

### 4. Jalankan Server

```bash
bun run dev
```

Server akan berjalan di `http://localhost:4001/graphql`

## 🔐 Autentikasi

GraphQL wrapper meneruskan JWT token dari client ke REST API:

1. Client mengirim token di header `Authorization: Bearer <token>`
2. Server GraphQL mengekstrak token dari header
3. Token diteruskan ke REST API saat memanggil endpoint yang memerlukan autentikasi

## 📚 Contoh Query dan Mutation

### Health Check

```graphql
query {
  health {
    status
    timestamp
    restApiUrl
  }
}
```

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
      role
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
    user {
      id
      username
      email
    }
  }
}
```

**Get Current User** (memerlukan token)
```graphql
query {
  me {
    id
    username
    email
    role
  }
}
```

### Novels

**Get All Novels**
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
        createdAt
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

**Get Novel by ID**
```graphql
query {
  novel(id: "novel-uuid") {
    id
    title
    slug
    synopsis
    status
    author {
      id
      username
    }
  }
}
```

**Get Popular Novels**
```graphql
query {
  popularNovels(limit: 5) {
    id
    title
    slug
    averageRating
    viewsCount
  }
}
```

**Create Novel** (memerlukan token)
```graphql
mutation {
  createNovel(input: {
    title: "Novel Baru"
    synopsis: "Deskripsi novel"
    status: ONGOING
  }) {
    id
    title
    slug
    status
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
        viewsCount
        publishedAt
      }
    }
    totalCount
  }
}
```

**Get Chapter by ID**
```graphql
query {
  chapter(id: "chapter-uuid") {
    id
    title
    chapterNum
    content
    novel {
      id
      title
    }
  }
}
```

**Create Chapter** (memerlukan token)
```graphql
mutation {
  createChapter(novelId: "novel-uuid", input: {
    title: "Chapter 1"
    content: "Konten chapter..."
    chapterNum: 1
  }) {
    id
    title
    chapterNum
  }
}
```

### Genres

**Get All Genres**
```graphql
query {
  genres {
    id
    name
    slug
  }
}
```

**Create Genre** (admin only)
```graphql
mutation {
  createGenre(name: "Fantasy") {
    id
    name
    slug
  }
}
```

### Bookmarks

**Get User Bookmarks** (memerlukan token)
```graphql
query {
  userBookmarks(page: 1, limit: 10) {
    edges {
      node {
        id
        novel {
          id
          title
        }
        createdAt
      }
    }
    totalCount
  }
}
```

**Add Bookmark** (memerlukan token)
```graphql
mutation {
  addBookmark(novelId: "novel-uuid") {
    id
    novel {
      title
    }
  }
}
```

### Comments

**Add Comment** (memerlukan token)
```graphql
mutation {
  addComment(chapterId: "chapter-uuid", content: "Komentar saya") {
    id
    content
    createdAt
  }
}
```

### Ratings

**Rate Novel** (memerlukan token)
```graphql
mutation {
  rateNovel(novelId: "novel-uuid", score: 5) {
    id
    score
    novel {
      title
    }
  }
}
```

## 🔧 Development

### GraphQL Code Generator (Opsional)

Generate TypeScript types dari schema:

```bash
bun run codegen
```

### Testing dengan Apollo Sandbox

1. Buka browser dan akses `http://localhost:4001/graphql`
2. Gunakan Apollo Sandbox untuk menjalankan query/mutation
3. Untuk endpoint yang memerlukan autentikasi, tambahkan header:
   ```
   Authorization: Bearer <your-access-token>
   ```

## 📝 Tips Pengembangan Selanjutnya

1. **DataLoader untuk N+1 Problem**
   - Implementasi DataLoader untuk batch requests
   - Contoh: saat fetch multiple novels, batch author lookups

2. **Subscriptions**
   - Tambahkan WebSocket support untuk real-time updates
   - Contoh: notifikasi chapter baru

3. **Caching**
   - Implementasi response caching
   - Gunakan Redis untuk distributed cache

4. **Rate Limiting**
   - Tambahkan rate limiting di GraphQL layer

5. **Query Complexity Analysis**
   - Batasi kompleksitas query untuk mencegah abuse

## 📄 License

MIT License

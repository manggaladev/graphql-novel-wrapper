import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../config';

// Types for REST API responses
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'ADMIN' | 'USER';
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Novel {
  id: string;
  title: string;
  slug: string;
  synopsis?: string;
  coverUrl?: string;
  status: 'ONGOING' | 'COMPLETED' | 'HIATUS';
  publishedAt?: string;
  averageRating: number;
  totalChapters: number;
  viewsCount: number;
  authorId: string;
  author?: User;
  genres?: Genre[];
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  title: string;
  chapterNum: number;
  content: string;
  novelId: string;
  viewsCount: number;
  wordCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  novel?: Novel;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  chapterId: string;
  user?: User;
  chapter?: Chapter;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  userId: string;
  novelId: string;
  score: number;
  user?: User;
  novel?: Novel;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  novelId: string;
  novel?: Novel;
  createdAt: string;
}

export interface ReadingHistory {
  id: string;
  userId: string;
  chapterId: string;
  chapter?: Chapter;
  lastReadAt: string;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface NovelQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  genre?: string;
  search?: string;
  status?: 'ONGOING' | 'COMPLETED' | 'HIATUS';
}

export interface ChapterQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CreateNovelInput {
  title: string;
  synopsis?: string;
  status?: 'ONGOING' | 'COMPLETED' | 'HIATUS';
  genres?: string[];
  coverUrl?: string;
}

export interface UpdateNovelInput {
  title?: string;
  synopsis?: string;
  status?: 'ONGOING' | 'COMPLETED' | 'HIATUS';
  genres?: string[];
  coverUrl?: string;
}

export interface CreateChapterInput {
  title: string;
  content: string;
  chapterNum?: number;
}

export interface UpdateChapterInput {
  title?: string;
  content?: string;
  chapterNum?: number;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Custom error class for API errors
export class APIError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number, code: string = 'API_ERROR') {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

// NovelAPI Data Source
export class NovelAPI {
  private client: AxiosInstance;
  private token?: string;

  constructor(token?: string) {
    this.token = token;
    this.client = axios.create({
      baseURL: config.restApiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }

  // Helper method to handle errors
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>;
      const message = axiosError.response?.data?.message 
        || axiosError.response?.data?.error 
        || axiosError.message;
      const statusCode = axiosError.response?.status || 500;
      const code = axiosError.code || 'API_ERROR';
      throw new APIError(message, statusCode, code);
    }
    throw error;
  }

  // ==================== AUTH ====================

  async register(input: RegisterInput): Promise<AuthPayload> {
    try {
      const response = await this.client.post<AuthPayload>('/auth/register', input);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    try {
      const response = await this.client.post<AuthPayload>('/auth/login', input);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthPayload> {
    try {
      const response = await this.client.post<AuthPayload>('/auth/refresh', { refreshToken });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async logout(refreshToken: string): Promise<boolean> {
    try {
      await this.client.post('/auth/logout', { refreshToken });
      return true;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMe(): Promise<User> {
    try {
      const response = await this.client.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ==================== NOVELS ====================

  async getNovels(params: NovelQueryParams = {}): Promise<PaginatedResponse<Novel>> {
    try {
      const response = await this.client.get<PaginatedResponse<Novel>>('/novels', { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getNovelById(id: string): Promise<Novel> {
    try {
      const response = await this.client.get<Novel>(`/novels/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getNovelBySlug(slug: string): Promise<Novel> {
    try {
      const response = await this.client.get<Novel>(`/novels/slug/${slug}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getPopularNovels(limit: number = 10): Promise<Novel[]> {
    try {
      const response = await this.client.get<Novel[]>('/novels/popular', { params: { limit } });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getLatestNovels(limit: number = 10): Promise<Novel[]> {
    try {
      const response = await this.client.get<Novel[]>('/novels/latest', { params: { limit } });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createNovel(input: CreateNovelInput): Promise<Novel> {
    try {
      const response = await this.client.post<Novel>('/novels', input);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateNovel(id: string, input: UpdateNovelInput): Promise<Novel> {
    try {
      const response = await this.client.put<Novel>(`/novels/${id}`, input);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteNovel(id: string): Promise<boolean> {
    try {
      await this.client.delete(`/novels/${id}`);
      return true;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ==================== CHAPTERS ====================

  async getChapters(novelId: string, params: ChapterQueryParams = {}): Promise<PaginatedResponse<Chapter>> {
    try {
      const response = await this.client.get<PaginatedResponse<Chapter>>(`/chapters/novel/${novelId}`, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getChapterById(id: string): Promise<Chapter> {
    try {
      const response = await this.client.get<Chapter>(`/chapters/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getChapterByNumber(novelId: string, chapterNum: number): Promise<Chapter> {
    try {
      const response = await this.client.get<Chapter>(`/chapters/novel/${novelId}/${chapterNum}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createChapter(novelId: string, input: CreateChapterInput): Promise<Chapter> {
    try {
      const response = await this.client.post<Chapter>(`/chapters/novel/${novelId}`, input);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateChapter(id: string, input: UpdateChapterInput): Promise<Chapter> {
    try {
      const response = await this.client.put<Chapter>(`/chapters/${id}`, input);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteChapter(id: string): Promise<boolean> {
    try {
      await this.client.delete(`/chapters/${id}`);
      return true;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ==================== GENRES ====================

  async getGenres(): Promise<Genre[]> {
    try {
      const response = await this.client.get<Genre[]>('/genres');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getGenreById(id: string): Promise<Genre> {
    try {
      const response = await this.client.get<Genre>(`/genres/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createGenre(name: string): Promise<Genre> {
    try {
      const response = await this.client.post<Genre>('/genres', { name });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateGenre(id: string, name: string): Promise<Genre> {
    try {
      const response = await this.client.put<Genre>(`/genres/${id}`, { name });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteGenre(id: string): Promise<boolean> {
    try {
      await this.client.delete(`/genres/${id}`);
      return true;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ==================== BOOKMARKS ====================

  async getBookmarks(): Promise<PaginatedResponse<Bookmark>> {
    try {
      const response = await this.client.get<PaginatedResponse<Bookmark>>('/bookmarks');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async addBookmark(novelId: string): Promise<Bookmark> {
    try {
      const response = await this.client.post<Bookmark>(`/bookmarks/${novelId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async removeBookmark(novelId: string): Promise<boolean> {
    try {
      await this.client.delete(`/bookmarks/${novelId}`);
      return true;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ==================== COMMENTS ====================

  async getComments(chapterId: string, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Comment>> {
    try {
      const response = await this.client.get<PaginatedResponse<Comment>>(`/comments/chapter/${chapterId}`, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMyComments(): Promise<Comment[]> {
    try {
      const response = await this.client.get<Comment[]>('/comments/my');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async addComment(chapterId: string, content: string): Promise<Comment> {
    try {
      const response = await this.client.post<Comment>(`/comments/chapter/${chapterId}`, { content });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateComment(id: string, content: string): Promise<Comment> {
    try {
      const response = await this.client.put<Comment>(`/comments/${id}`, { content });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteComment(id: string): Promise<boolean> {
    try {
      await this.client.delete(`/comments/${id}`);
      return true;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ==================== RATINGS ====================

  async getRatings(novelId: string): Promise<PaginatedResponse<Rating>> {
    try {
      const response = await this.client.get<PaginatedResponse<Rating>>(`/ratings/${novelId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMyRating(novelId: string): Promise<Rating | null> {
    try {
      const response = await this.client.get<Rating>(`/ratings/${novelId}/me`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      this.handleError(error);
    }
  }

  async rateNovel(novelId: string, score: number): Promise<Rating> {
    try {
      const response = await this.client.post<Rating>(`/ratings/${novelId}`, { score });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async removeRating(novelId: string): Promise<boolean> {
    try {
      await this.client.delete(`/ratings/${novelId}`);
      return true;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ==================== READING HISTORY ====================

  async getReadingHistory(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<ReadingHistory>> {
    try {
      const response = await this.client.get<PaginatedResponse<ReadingHistory>>('/history', { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async clearHistory(): Promise<boolean> {
    try {
      await this.client.delete('/history');
      return true;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteHistoryEntry(id: string): Promise<boolean> {
    try {
      await this.client.delete(`/history/${id}`);
      return true;
    } catch (error) {
      this.handleError(error);
    }
  }
}

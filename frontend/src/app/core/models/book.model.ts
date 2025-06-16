import { Author } from './author.model';
import { Genre } from './genres.model';
import { Publisher } from './publisher.model';

export interface BookResponse {
  success: boolean;
  data: Book;
  timestamp: Date;
}

export interface Book {
  id: number;
  title: string;
  price: string;
  available: boolean;
  imagePath: string;
  author: Author;
  publisher: Publisher;
  genres: Genre[];
  deletedAt?: null | string;
}

export interface BookFilters {
  page?: number;
  limit?: number;
  title?: string;
  authorId?: number;
  publisherId?: number;
  genreId?: number;
  available?: boolean;
  orderBy?: string;
  orderDir?: 'ASC' | 'DESC';
}

export interface ListBooksResponse {
  success: boolean;
  data: Data;
  timestamp: Date;
}

export interface Data {
  items: Book[];
  total: number;
  page: number;
  limit: number;
}

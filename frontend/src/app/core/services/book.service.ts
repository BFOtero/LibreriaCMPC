import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import {
  Book,
  BookFilters,
  BookResponse,
  ListBooksResponse,
} from '../models/book.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient) {}

  private authUrl = 'http://localhost:3000/api/book';

  getBooks(filters: BookFilters): Observable<ListBooksResponse> {
    let params = new HttpParams()
      .set('page', filters.page?.toString() || '1')
      .set('limit', filters.limit?.toString() || '10');

    if (filters.title) params = params.set('title', filters.title);
    if (filters.authorId)
      params = params.set('authorId', filters.authorId.toString());
    if (filters.genreId)
      params = params.set('genreId', filters.genreId.toString());
    if (filters.publisherId)
      params = params.set('publisherId', filters.publisherId.toString());
    if (filters.available !== undefined)
      params = params.set('available', filters.available.toString());
    if (filters.orderBy) params = params.set('orderBy', filters.orderBy);
    if (filters.orderDir) params = params.set('orderDir', filters.orderDir);

    return this.http.get<ListBooksResponse>(`${this.authUrl}`, { params });
  }

  uploadImage(file: File): Observable<{ data: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ data: string }>(
      'http://localhost:3000/api/files/book',
      formData
    );
  }

  updateBook(book: Book): Observable<any> {
    return this.http.patch(`${this.authUrl}/${book.id}`, book);
  }

  getBook(id: string): Observable<BookResponse | null> {
    return this.http.get<BookResponse>(`${this.authUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('book error:', error);
        const errorMsg =
          error.status === 401
            ? 'Invalid credentials'
            : 'book failed. Please try again later.';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  createBook(book: Book): Observable<any> {
    delete book.deletedAt;
    return this.http.post(`${this.authUrl}`, book);
  }

  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(`${this.authUrl}/${bookId}`);
  }
}

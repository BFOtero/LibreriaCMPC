import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GenreResponse } from '../models/genres.model';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  constructor(private http: HttpClient) {}

  private authUrl = 'http://localhost:3000/api/genre';

  loadGenres(): Observable<GenreResponse> {
    return this.http.get<GenreResponse>(this.authUrl).pipe(
      catchError((error) => {
        console.error('../genre error:', error);
        const errorMsg =
          error.status === 401
            ? 'Invalid credentials'
            : '../genre failed. Please try again later.';
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}

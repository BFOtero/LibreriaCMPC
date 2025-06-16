import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { SessionService } from './session.service';
import { User, AuthResponse, LoginRequest } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { AuthorResponse } from '../models/author.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  constructor(private http: HttpClient) {}

  private authUrl = 'http://localhost:3000/api/author';

  loadAuthors(): Observable<AuthorResponse> {
    return this.http.get<AuthorResponse>(this.authUrl).pipe(
      tap((response) => {}),
      catchError((error) => {
        console.error('../author error:', error);
        const errorMsg =
          error.status === 401
            ? 'Invalid credentials'
            : '../author failed. Please try again later.';
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}

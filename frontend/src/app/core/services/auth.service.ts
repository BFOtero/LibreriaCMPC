import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { SessionService } from './session.service';
import { User, AuthResponse, LoginRequest } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private sessionService: SessionService,
    private http: HttpClient
  ) {}

  private authUrl = 'http://localhost:3000/api/auth/login';

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.authUrl, loginRequest).pipe(
      tap((response) => {
        this.sessionService.setSession(
          {
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
          },
          response.data.token
        );
      }),
      catchError((error) => {
        console.error('Login error:', error);
        const errorMsg =
          error.status === 401
            ? 'Invalid credentials'
            : 'Login failed. Please try again later.';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  logout(): Observable<void> {
    return of(void 0).pipe(
      delay(500),
      tap(() => {
        this.sessionService.clearSession();
      })
    );
  }

  isLoggedIn(): boolean {
    return this.sessionService.isLoggedIn();
  }

  getCurrentUser(): User | null {
    return this.sessionService.getCurrentUser();
  }
}

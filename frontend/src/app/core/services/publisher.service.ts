import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PublisherResponse } from '../models/publisher.model';

@Injectable({
  providedIn: 'root',
})
export class PublisherService {
  constructor(private http: HttpClient) {}

  private authUrl = 'http://localhost:3000/api/publisher';

  loadpublishers(): Observable<PublisherResponse> {
    return this.http.get<PublisherResponse>(this.authUrl).pipe(
      catchError((error) => {
        console.error('../publisher error:', error);
        const errorMsg =
          error.status === 401
            ? 'Invalid credentials'
            : '../publisher failed. Please try again later.';
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}

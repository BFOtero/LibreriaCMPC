import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'books',
        loadComponent: () =>
          import('./features/books/book-list/book-list.component').then(
            (m) => m.BookListComponent
          ),
      },
      {
        path: 'books/create',
        loadComponent: () =>
          import('./features/books/book-form/book-form.component').then(
            (m) => m.BookFormComponent
          ),
      },
      {
        path: 'books/edit/:id',
        loadComponent: () =>
          import('./features/books/book-form/book-form.component').then(
            (m) => m.BookFormComponent
          ),
      },
    ],
  },

  { path: '**', redirectTo: '/books' },
];

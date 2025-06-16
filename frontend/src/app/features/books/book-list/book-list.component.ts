import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BookService } from '../../../core/services/book.service';
import { Book, BookFilters } from '../../../core/models/book.model';
import { PublisherService } from '../../../core/services/publisher.service';
import { GenreService } from '../../../core/services/genre.service';
import { MatSelectModule } from '@angular/material/select';
import { Publisher } from '../../../core/models/publisher.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './book-list.component.html',
  styles: [],
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  filtersForm: FormGroup;
  isLoading = false;

  currentPage = 1;
  pageSize = 10;
  total = 0;
  totalPages = 0;

  currentSort = 'title';
  sortOrder: 'ASC' | 'DESC' = 'ASC';

  availableYears: number[] = [];

  showDeleteModal = false;
  bookToDelete: Book | null = null;

  listGenres: any[] = [];
  listPublisher: Publisher[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private toastr: ToastrService,
    private publisherService: PublisherService,
    private genreService: GenreService
  ) {
    this.filtersForm = this.fb.group({
      title: [''],
      publisher: [''],
      genre: [''],
      sortField: [''],
    });
  }

  ngOnInit() {
    this.setupFilters();
    this.loadBooks();
    this.generateAvailableYears();
    this.loadGenres();
    this.loadPublishers();
    this.filtersForm
      .get('title')!
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;
        this.loadBooks();
      });
    this.filtersForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) =>
            prev.genre === curr.genre && prev.publisher === curr.publisher
        )
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadBooks();
      });
  }

  createBook() {
    this.router.navigate(['/books/create']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadGenres() {
    this.genreService.loadGenres().subscribe({
      next: (genres) => {
        this.listGenres = genres.data;
      },
      error: (error) => {
        this.toastr.error('Error al cargar el libro', 'Error');
      },
    });
  }

  private loadPublishers() {
    this.publisherService.loadpublishers().subscribe({
      next: (publisher) => {
        this.listPublisher = publisher.data;
      },
      error: (error) => {
        this.toastr.error('Error al cargar el libro', 'Error');
      },
    });
  }

  onSortChange() {
    const sortValue = this.filtersForm.value.sortField;

    if (!sortValue) {
      this.currentSort = 'title';
      this.sortOrder = 'ASC';
    } else {
      const [field, order] = sortValue.split('_');
      this.currentSort = field as 'title' | '../author';
      this.sortOrder = order as 'ASC' | 'DESC';
    }

    this.loadBooks();
  }

  private setupFilters() {
    this.filtersForm.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;
        this.loadBooks();
      });
  }

  private generateAvailableYears() {
    const currentYear = new Date().getFullYear();
    this.availableYears = [];
    for (let year = currentYear; year >= 2000; year--) {
      this.availableYears.push(year);
    }
  }

  loadBooks() {
    this.isLoading = true;
    const filters = {
      title: this.filtersForm.value.title || undefined,
      genreId: this.filtersForm.value.genre
        ? Number(this.filtersForm.value.genre.id)
        : undefined,
      publisherId:
        this.filtersForm.value.publisher !== undefined
          ? Number(this.filtersForm.value.publisher.id)
          : undefined,
      page: this.currentPage,
      limit: this.pageSize,
      orderBy: this.currentSort,
      orderDir: this.sortOrder,
    };

    this.bookService.getBooks(filters).subscribe({
      next: (response) => {
        this.books = response.data.items;
        this.total = response.data.total;
        this.totalPages = Math.ceil(response.data.total / response.data.limit);
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Error al cargar los libros', 'Error');
        this.isLoading = false;
      },
    });
  }

  sortBy(field: string) {
    if (this.currentSort === field) {
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.currentSort = field;
      this.sortOrder = 'ASC';
    }
    this.loadBooks();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBooks();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBooks();
    }
  }

  editBook(id: number) {
    this.router.navigate(['/books/edit', id]);
  }

  deleteBook(book: Book) {
    this.bookToDelete = book;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.bookToDelete) {
      this.bookService.deleteBook(this.bookToDelete!.id).subscribe({
        next: () => {
          this.toastr.success('Libro eliminado correctamente', 'Éxito');
          this.loadBooks();
          this.cancelDelete();
        },
        error: (error) => {
          this.toastr.error('Error al eliminar el libro', 'Error');
        },
      });
    }
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.bookToDelete = null;
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    this.loadBooks();
  }

  Math = Math;
}

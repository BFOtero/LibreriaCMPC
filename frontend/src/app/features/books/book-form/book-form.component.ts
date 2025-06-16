import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookService } from '../../../core/services/book.service';
import { AuthorService } from '../../../core/services/author.service';
import { Author } from '../../../core/models/author.model';

import { MatSelectModule } from '@angular/material/select';
import { GenreService } from '../../../core/services/genre.service';
import { Genre } from '../../../core/models/genres.model';
import { Publisher } from '../../../core/models/publisher.model';
import { PublisherService } from '../../../core/services/publisher.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './book-form.component.html',
  styles: [
    `
      input.example-right-align::-webkit-outer-spin-button,
      input.example-right-align::-webkit-inner-spin-button {
        display: none;
      }

      input.example-right-align {
        -moz-appearance: textfield;
      }
    `,
  ],
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  bookId?: number;
  selectedFile?: File;
  imagePreview?: string;
  isEnabled: boolean = true;

  listAuthors: Author[] = [];
  listAuthorsSelected: Author[] = [];
  listGenres: Genre[] = [];
  listGenresSelected: Genre[] = [];
  listPublisher: Publisher[] = [];

  compareById = (a: any, b: any) => a && b && a.id === b.id;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private genreService: GenreService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      author: [[], [Validators.required]],
      genre: [[], [Validators.required]],
      publisher: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(1000)]],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.bookId = parseInt(params['id']);
        this.loadBook();
      }
    });
    this.loadAuthors();
    this.loadGenres();
    this.loadPublishers();
  }

  private loadAuthors() {
    this.authorService.loadAuthors().subscribe({
      next: (authors) => {
        this.listAuthors = authors.data;
      },
      error: (error) => {
        this.toastr.error('Error al cargar el libro', 'Error');
        this.goBack();
      },
    });
  }

  private loadGenres() {
    this.genreService.loadGenres().subscribe({
      next: (genres) => {
        this.listGenres = genres.data;
      },
      error: (error) => {
        this.toastr.error('Error al cargar el libro', 'Error');
        this.goBack();
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
        this.goBack();
      },
    });
  }

  private loadBook() {
    if (this.bookId) {
      this.bookService.getBook(this.bookId + '').subscribe({
        next: (book) => {
          if (book) {
            this.bookForm.patchValue({
              title: book.data.title,
              author: book.data.author!,
              genre: book.data.genres!,
              publisher: book.data.publisher!,
              price: book.data.price,
            });
            this.isEnabled = book.data.available;
            if (book.data.imagePath) {
              this.imagePreview = `http://localhost:3000/api/files/book/${book.data.imagePath}`;
            }
            this.getAuthorsNames();
          } else {
            this.toastr.error('Libro no encontrado', 'Error');
            this.goBack();
          }
        },
        error: (error) => {
          this.toastr.error('Error al cargar el libro', 'Error');
          this.goBack();
        },
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.toastr.error(
          'Por favor selecciona un archivo de imagen válido',
          'Error'
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.toastr.error('La imagen debe ser menor a 5MB', 'Error');
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (!this.bookForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;

    const baseData = {
      title: this.bookForm.value.title,
      author: this.bookForm.value.author,
      available: this.isEnabled,
      genres: this.bookForm.value.genre,
      publisher: this.bookForm.value.publisher,
      price: +this.bookForm.value.price,
    };

    try {
      let imagePath: string | undefined;

      if (this.selectedFile) {
        const uploadResponse = await firstValueFrom(
          this.bookService.uploadImage(this.selectedFile)
        );
        imagePath = uploadResponse.data;
      }

      let payload: any = {
        ...baseData,
        ...(imagePath ? { imagePath } : {}),
        deletedAt: null,
      };

      if (this.isEditMode && this.bookId !== undefined) {
        payload.id = this.bookId;
      }

      if (this.isEditMode && this.bookId) {
        await firstValueFrom(this.bookService.updateBook(payload));
        this.toastr.success('Libro actualizado correctamente', 'Éxito');
      } else {
        await firstValueFrom(this.bookService.createBook(payload));
        this.toastr.success('Libro creado correctamente', 'Éxito');
      }

      this.router.navigate(['/books']);
    } catch (error) {
      const action = this.isEditMode ? 'actualizar' : 'crear';
      this.toastr.error(`Error al ${action} el libro`, 'Error');
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.bookForm.controls).forEach((key) => {
      const control = this.bookForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack() {
    this.router.navigate(['/books']);
  }

  getAuthorsNames(): void {
    const selectedAuthorIds = this.bookForm.get('../author')?.value;

    this.listAuthorsSelected = selectedAuthorIds.name;
  }

  toggleState() {
    this.isEnabled = !this.isEnabled;
  }
}

import { TestBed } from '@angular/core/testing';
import { BookService } from './book.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  Book,
  BookFilters,
  BookResponse,
  ListBooksResponse,
} from '../models/book.model';

describe('../bookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:3000/api/book';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService],
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload image and return a data string', () => {
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    const mockResponse = { data: 'http://url.to/image.jpg' };

    service.uploadImage(file).subscribe((res) => {
      expect(res.data).toEqual(jasmine.any(String));
    });

    const req = httpMock.expectOne('http://localhost:3000/api/files/book');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush(mockResponse);
  });

  it('should update a book', () => {
    const book: Book = {
      id: 1,
      title: 'Updated Title',
      price: '20.00',
      available: true,
      imagePath: 'path.jpg',
      author: { id: '1', name: 'Autor' },
      publisher: { id: '1', name: 'Editorial' },
      genres: [],
    };

    service.updateBook(book).subscribe((res) => {
      expect(res).toBeDefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should get a single book and validate type', () => {
    const mockResponse: BookResponse = {
      success: true,
      timestamp: new Date(),
      data: {
        id: 1,
        title: 'Single Book',
        price: '10.00',
        available: true,
        imagePath: 'path.jpg',
        author: { id: '1', name: 'Autor' },
        publisher: { id: '1', name: 'Editorial' },
        genres: [{ id: '1', name: 'Género' }],
      },
    };

    service.getBook('1').subscribe((res) => {
      expect(res?.success).toBeTrue();
      expect(res?.timestamp).toEqual(jasmine.any(Date));
      expect(res?.data.id).toEqual(jasmine.any(Number));
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a book', () => {
    const book: Book = {
      id: 1,
      title: 'Nuevo libro',
      price: '22.50',
      available: true,
      imagePath: '',
      author: { id: '1', name: 'Autor' },
      publisher: { id: '1', name: 'Editorial' },
      genres: [],
      deletedAt: null,
    };

    service.createBook(book).subscribe((res) => {
      expect(res).toBeDefined();
    });

    const { deletedAt, ...expectedBook } = book;
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(expectedBook);
    req.flush({});
  });

  it('should delete a book by id', () => {
    service.deleteBook(1).subscribe((res) => {
      expect(res).toBeDefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});

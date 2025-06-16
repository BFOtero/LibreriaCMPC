import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  softDelete: jest.fn(),
  restore: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
});

const mockQueryBuilder: any = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
};

describe('../bookService', () => {
  let service: BookService;
  let repository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a book', async () => {
    const dto = { title: 'Title', price: '10', available: true };
    const book = { id: 1, ...dto };
    jest.spyOn(repository, 'create').mockReturnValue(book as any);
    jest.spyOn(repository, 'save').mockResolvedValue(book as any);

    const result = await service.create(dto as any);
    expect(result).toEqual(book);
  });

  it('should return list of books', async () => {
    const result = await service.findAll({});
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('should return one book', async () => {
    const book = { id: 1 };
    jest.spyOn(repository, 'findOne').mockResolvedValue(book as any);
    const result = await service.findOne(1);
    expect(result).toEqual(book);
  });

  it('should update a book', async () => {
    const book = { id: 1, title: 'Old' };
    const updated = { id: 1, title: 'New' };
    jest.spyOn(service, 'findOne').mockResolvedValue(book as any);
    jest.spyOn(repository, 'preload').mockResolvedValue(updated as any);
    jest.spyOn(repository, 'save').mockResolvedValue(updated as any);

    const result = await service.update(1, { title: 'New' });
    expect(result).toEqual(updated);
  });

  it('should soft delete a book', async () => {
    jest
      .spyOn(repository, 'softDelete')
      .mockResolvedValue({ affected: 1 } as any);
    await expect(service.remove(1)).resolves.toBeUndefined();
  });

  it('should restore a book', async () => {
    jest.spyOn(repository, 'restore').mockResolvedValue({ affected: 1 } as any);
    await expect(service.restore(1)).resolves.toBeUndefined();
  });
});

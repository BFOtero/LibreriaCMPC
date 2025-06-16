import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

const mockBookService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  restore: jest.fn(),
};

describe('../bookController', () => {
  let controller: BookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [{ provide: BookService, useValue: mockBookService }],
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create with correct params', async () => {
    const dto: CreateBookDto = {
      title: 'Libro',
      price: 1000,
      available: true,
      imageUrl: 'image.jpg',
      author: { name: 'Autor' },
      publisher: { name: 'Editorial' },
      genres: [{ name: 'Género' }],
    };
    await controller.create(dto);
    expect(mockBookService.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAll with query params', async () => {
    const query = { page: 1, limit: 10 };
    await controller.findAll(query.page, query.limit);
    expect(mockBookService.findAll).toHaveBeenCalled();
  });

  it('should call findOne with ID', async () => {
    await controller.findOne(1);
    expect(mockBookService.findOne).toHaveBeenCalledWith(1);
  });

  it('should call update with ID and DTO', async () => {
    const dto: UpdateBookDto = { title: 'Updated Title' };
    await controller.update(1, dto);
    expect(mockBookService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call remove with ID', async () => {
    await controller.remove(1);
    expect(mockBookService.remove).toHaveBeenCalledWith(1);
  });

  it('should call restore with ID', async () => {
    await controller.restore(1);
    expect(mockBookService.restore).toHaveBeenCalledWith(1);
  });
});

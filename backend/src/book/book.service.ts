import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';

import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    const saved = await this.bookRepository.save(book);

    return saved;
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    title?: string;
    authorId?: number;
    publisherId?: number;
    genreId?: number;
    available?: boolean;
    orderBy?: string;
    orderDir?: 'ASC' | 'DESC';
  }) {
    const {
      page = 1,
      limit = 10,
      title,
      authorId,
      publisherId,
      genreId,
      available,
      orderBy = 'title',
      orderDir = 'ASC',
    } = params;

    const skip = (page - 1) * limit;

    const query = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .leftJoinAndSelect('book.genres', 'genre')
      .where('1=1');

    if (title) {
      query.andWhere('LOWER(book.title) LIKE :title', {
        title: `%${title.toLowerCase()}%`,
      });
    }

    if (authorId) {
      query.andWhere('author.id = :authorId', { authorId });
    }

    if (publisherId) {
      query.andWhere('publisher.id = :publisherId', { publisherId });
    }

    if (genreId) {
      query.andWhere('genre.id = :genreId', { genreId });
    }

    if (available !== undefined) {
      query.andWhere('book.available = :available', { available });
    }

    const validOrderFields = {
      title: 'book.title',
      author: 'author.name',
    };

    const orderField = validOrderFields[orderBy] || 'book.title';

    query.orderBy(orderField, orderDir);

    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['author', 'publisher', 'genres'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    if (book && updateBookDto.imageUrl) {
      const fs = await import('fs');
      fs.unlink(`./uploads/books/${book.imagePath}`, () => {});
    }
    const newBook = await this.bookRepository.preload({
      id: id,
      ...updateBookDto,
    });
    if (!newBook) {
      throw new Error(`Book with ID ${id} not found`);
    }

    return this.bookRepository.save(newBook);
  }

  async remove(id: number): Promise<void> {
    const result = await this.bookRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Book with ID ${id} not found or already deleted`,
      );
    }
  }

  async restore(id: number): Promise<void> {
    const bookRestore = await this.bookRepository.restore(id);
    if (!bookRestore) {
      throw new Error(`Book with ID ${id} not found or not deleted`);
    }
  }
}

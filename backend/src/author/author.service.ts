import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author = await this.authorRepository.create(createAuthorDto);
    return author;
  }

  async findAll(): Promise<Author[]> {
    const authors = await this.authorRepository.find();
    return authors;
  }

  async findOne(id: number) {
    const author = await this.authorRepository.findBy({ id });
    return author[0];
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    const newAuthor = await this.authorRepository.preload({
      id: id,
      ...updateAuthorDto,
    });

    if (!newAuthor) {
      throw new Error(`Author with ID ${id} not found`);
    }

    return this.authorRepository.save(newAuthor);
  }
  async remove(id: number): Promise<void> {
    const result = await this.authorRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Author with ID ${id} not found or already deleted`,
      );
    }
  }

  async restore(id: number): Promise<void> {
    const authorRestore = await this.authorRepository.restore(id);
    if (!authorRestore) {
      throw new Error(`Author with ID ${id} not found or not deleted`);
    }
  }
}

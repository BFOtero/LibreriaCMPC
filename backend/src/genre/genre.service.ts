import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const genre = await this.genreRepository.create(createGenreDto);
    return genre;
  }

  async findAll(): Promise<Genre[]> {
    const genres = await this.genreRepository.find();
    return genres;
  }

  async findOne(id: number) {
    const genre = await this.genreRepository.findBy({ id });
    return genre[0];
  }
  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const newGenre = await this.genreRepository.preload({
      id: id,
      ...updateGenreDto,
    });

    if (!newGenre) {
      throw new Error(`Genre with ID ${id} not found`);
    }

    return this.genreRepository.save(newGenre);
  }
  async remove(id: number): Promise<void> {
    const result = await this.genreRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Genre with ID ${id} not found or already deleted`,
      );
    }
  }

  async restore(id: number): Promise<void> {
    const genreRestore = await this.genreRepository.restore(id);
    if (!genreRestore) {
      throw new Error(`Genre with ID ${id} not found or not deleted`);
    }
  }
}

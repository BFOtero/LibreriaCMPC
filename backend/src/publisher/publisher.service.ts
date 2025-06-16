import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from './entities/publisher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PublisherService {
  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
  ) {}

  async create(createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    const publisher = await this.publisherRepository.create(createPublisherDto);
    return publisher;
  }

  async findAll(): Promise<Publisher[]> {
    const publishers = await this.publisherRepository.find();
    return publishers;
  }

  async findOne(id: number) {
    const publisher = await this.publisherRepository.findBy({ id });
    return publisher;
  }

  async update(id: number, updatePublisherDto: UpdatePublisherDto) {
    const newPublisher = await this.publisherRepository.preload({
      id: id,
      ...updatePublisherDto,
    });

    if (!newPublisher) {
      throw new Error(`publisher with ID ${id} not found`);
    }

    return this.publisherRepository.save(newPublisher);
  }
  async remove(id: number): Promise<void> {
    const result = await this.publisherRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        `publisher with ID ${id} not found or already deleted`,
      );
    }
  }

  async restore(id: number): Promise<void> {
    const publisherRestore = await this.publisherRepository.restore(id);
    if (!publisherRestore) {
      throw new Error(`publisher with ID ${id} not found or not deleted`);
    }
  }
}

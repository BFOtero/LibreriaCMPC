import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../author/entities/author.entity';
import { Genre } from '../genre/entities/genre.entity';
import { Publisher } from '../publisher/entities/publisher.entity';
import { Book } from '../book/entities/book.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Genre, Publisher, Book, User])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}

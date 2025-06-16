import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from '../author/entities/author.entity';
import { Repository } from 'typeorm';
import { Genre } from '../genre/entities/genre.entity';
import { Publisher } from '../publisher/entities/publisher.entity';
import { Book } from '../book/entities/book.entity';
import { User } from '../auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async executeSeed(): Promise<string> {
    await this.bookRepository.createQueryBuilder().delete().execute();
    await this.authorRepository.createQueryBuilder().delete().execute();
    await this.genreRepository.createQueryBuilder().delete().execute();
    await this.publisherRepository.createQueryBuilder().delete().execute();

    const author1 = this.authorRepository.create({ name: 'Isabel Allende' });
    const author2 = this.authorRepository.create({ name: 'Roberto Bolaño' });
    const author3 = this.authorRepository.create({ name: 'Marcela Serrano' });
    await this.authorRepository.save([author1, author2, author3]);

    const genre1 = this.genreRepository.create({ name: 'Ficción' });
    const genre2 = this.genreRepository.create({ name: 'Historia' });
    const genre3 = this.genreRepository.create({ name: 'Drama' });
    await this.genreRepository.save([genre1, genre2, genre3]);

    const publisher = await this.publisherRepository.save(
      this.publisherRepository.create({ name: 'Editorial Andrómeda' }),
    );
    const publisher2 = await this.publisherRepository.save(
      this.publisherRepository.create({ name: 'Editorial Debolsillo' }),
    );

    const userEmail = 'user@cmpc.cl';

    const existingUser = await this.userRepository.findOneBy({
      email: userEmail,
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('Abc123', 10);

      const newUser = this.userRepository.create({
        email: userEmail,
        password: hashedPassword,
        firstName: 'User',
        lastName: 'CMPC',
      });

      await this.userRepository.save(newUser);
    }

    const books = [
      this.bookRepository.create({
        title: 'La casa de los espíritus',
        price: 15990,
        available: true,
        publisher: { id: publisher.id },
        imagePath: 'la-casa-de-los-espiritus.jpg',
        author: { id: author1.id },
        genres: [{ id: genre1.id }, { id: genre3.id }],
      }),
      this.bookRepository.create({
        title: '2666',
        price: 18990,
        available: true,
        publisher: { id: publisher2.id },
        imagePath: '2666.jpeg',
        author: { id: author2.id },
        genres: [{ id: genre1.id }, { id: genre2.id }],
      }),
      this.bookRepository.create({
        title: 'Antigua vida mía',
        price: 9990,
        available: true,
        publisher: { id: publisher2.id },
        imagePath: 'antigua-vida-mia.jpeg',
        author: { id: author3.id },
        genres: [{ id: genre3.id }],
      }),
      this.bookRepository.create({
        title: 'Eva Luna',
        price: 12990,
        available: true,
        publisher: { id: publisher.id },
        imagePath: 'eva-luna.jpeg',
        author: { id: author1.id },
        genres: [{ id: genre1.id }],
      }),
      this.bookRepository.create({
        title: 'Los detectives salvajes',
        price: 14990,
        available: true,
        publisher: { id: publisher.id },
        imagePath: 'los-detectives-salvajes.jpg',
        author: { id: author2.id },
        genres: [{ id: genre1.id }, { id: genre3.id }],
      }),
      this.bookRepository.create({
        title: 'Para que no me olvides',
        price: 10990,
        available: true,
        publisher: { id: publisher2.id },
        imagePath: 'para-que-no-me-olvides.jpg',
        author: { id: author3.id },
        genres: [{ id: genre3.id }],
      }),
      this.bookRepository.create({
        title: 'Retrato en sepia',
        price: 13990,
        available: true,
        publisher: { id: publisher.id },
        imagePath: 'retrato-en-sepia.jpg',
        author: { id: author1.id },
        genres: [{ id: genre1.id }],
      }),
      this.bookRepository.create({
        title: 'Nocturno de Chile',
        price: 11990,
        available: true,
        publisher: { id: publisher.id },
        imagePath: 'nocturno-de-chile.jpg',
        author: { id: author2.id },
        genres: [{ id: genre2.id }],
      }),
      this.bookRepository.create({
        title: 'Nosotras que nos queremos tanto',
        price: 9990,
        available: true,
        publisher: { id: publisher2.id },
        imagePath: 'nosotras.jpg',
        author: { id: author3.id },
        genres: [{ id: genre3.id }],
      }),
      this.bookRepository.create({
        title: 'Inés del alma mía',
        price: 14990,
        available: true,
        publisher: { id: publisher2.id },
        imagePath: 'ines-del-alma-mia.jpg',
        author: { id: author1.id },
        genres: [{ id: genre2.id }],
      }),
      this.bookRepository.create({
        title: 'El gaucho insufrible',
        price: 13990,
        available: true,
        publisher: { id: publisher.id },
        imagePath: 'el-gaucho-insufrible.jpg',
        author: { id: author2.id },
        genres: [{ id: genre1.id }],
      }),
      this.bookRepository.create({
        title: 'El albergue de las mujeres tristes',
        price: 10990,
        available: true,
        publisher: { id: publisher.id },
        imagePath: 'albergue-mujeres-tristes.jpg',
        author: { id: author3.id },
        genres: [{ id: genre3.id }],
      }),
    ];

    await this.bookRepository.save(books);

    return 'Seeding completed successfully';
  }
}

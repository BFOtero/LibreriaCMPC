import { Author } from '../../author/entities/author.entity';
import { Genre } from '../../genre/entities/genre.entity';
import { Publisher } from '../../publisher/entities/publisher.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('decimal')
  price: number;

  @Column({ default: true })
  available: boolean;

  @Column()
  imagePath: string;

  @ManyToOne(() => Author, (author) => author.books)
  @JoinColumn({ name: 'authorId' })
  author: Author;

  @ManyToOne(() => Publisher, (publisher) => publisher.books)
  @JoinColumn({ name: 'publisherId' })
  publisher: Publisher;

  @ManyToMany(() => Genre, (genre) => genre.books)
  @JoinTable({ name: 'book_genre' })
  genres: Genre[];

  @DeleteDateColumn()
  deletedAt: Date;
}

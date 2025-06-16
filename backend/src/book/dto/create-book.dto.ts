import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { CreateAuthorDto } from '../../author/dto/create-author.dto';
import { CreateGenreDto } from '../../genre/dto/create-genre.dto';
import { CreatePublisherDto } from '../../publisher/dto/create-publisher.dto';

export class CreateBookDto {
  @IsString()
  title: string;

  @ValidateNested()
  author: CreateAuthorDto;

  @IsNotEmpty()
  @ValidateNested()
  publisher: CreatePublisherDto;

  @IsArray()
  @ValidateNested({ each: true })
  genres: CreateGenreDto[];

  @IsNumber()
  price: number;

  @IsBoolean()
  available: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

import { IsString, MinLength } from 'class-validator';

export class CreatePublisherDto {
  @IsString()
  @MinLength(2)
  name: string;
}

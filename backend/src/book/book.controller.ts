import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';

import { AuthGuard } from '@nestjs/passport';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
@UseGuards(AuthGuard())
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('title') title?: string,
    @Query('authorId') authorId?: number,
    @Query('publisherId') publisherId?: number,
    @Query('genreId') genreId?: number,
    @Query('available') available?: boolean,
    @Query('orderBy') orderBy?: string,
    @Query('orderDir') orderDir?: 'ASC' | 'DESC',
  ) {
    return this.bookService.findAll({
      page: Number(page),
      limit: Number(limit),
      title,
      authorId: authorId ? Number(authorId) : undefined,
      publisherId: publisherId ? Number(publisherId) : undefined,
      genreId: genreId ? Number(genreId) : undefined,
      available:
        available !== undefined ? String(available) === 'true' : undefined,
      orderBy: orderBy as any,
      orderDir,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }

  @Patch(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.restore(id);
  }
}

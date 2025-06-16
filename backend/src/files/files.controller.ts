import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('book/:imageName')
  getProductImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imagePath = this.filesService.getProductImagePath(imageName);
    return res.sendFile(imagePath);
  }

  @Post('book')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      storage: diskStorage({
        destination: './uploads/books',
        filename: fileNamer,
      }),
    }),
  )
  uploadBookImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File upload failed');
    }
    return file.filename;
  }
}

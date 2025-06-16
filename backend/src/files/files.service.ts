import { BadRequestException, Injectable } from '@nestjs/common';

import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  getProductImagePath(createFileDto: string): string {
    const path = join(process.cwd(), 'uploads', 'books', createFileDto);

    if (!existsSync(path)) {
      throw new BadRequestException(
        `No product found with image ${createFileDto}`,
      );
    }

    return path;
  }
}

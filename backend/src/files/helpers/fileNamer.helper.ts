import { v4 as uuidv4 } from 'uuid';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: Function,
): void => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

  if (!file) {
    return cb(new Error('File is Empty'), false);
  }

  const fileExtension = file.mimetype.split('/')[1];

  const fileName = `${uuidv4()}.${fileExtension}`;

  cb(null, fileName);
};

import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

import HttpException from '../exceptions/HttpException';


const multerStorage = multer.memoryStorage()

const multerFilter = (_req: Request, file: Express.Multer.File, cd: FileFilterCallback) => {
  if (file.mimetype.startsWith('image')) {
    cd(null, true);
  } else {
    cd(new HttpException(400, 'Not an image! Please upload only images'));
  }
};


export const imageUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1024 * 1024 * 250, files: 10 }, // 250MB and 10 file limit
});

export const postImageUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1024 * 1024 * 500, files: 10 }, // limit files to 5 and max size 500MB per file
});
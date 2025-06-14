import { Request, Response, NextFunction } from 'express';

export const gamePostFileValidator = (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

  if (files?.cover) {
    if (files.cover.length !== 1) {
      return res.status(400).json({ message: 'Exactly one cover image must be uploaded.' });
    }
    const coverFile = files.cover[0];
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(coverFile.mimetype)) {
      return res.status(400).json({ message: 'Cover image must be JPEG, PNG, or WEBP.' });
    }
    if (coverFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'Cover image size must be less than 5MB.' });
    }
  }

  if (files?.images) {
    if (files.images.length > 10) {
      return res.status(400).json({ message: 'You can upload maximum 10 images.' });
    }
    for (const img of files.images) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(img.mimetype)) {
        return res.status(400).json({ message: 'All images must be JPEG, PNG, or WEBP.' });
      }
      if (img.size > 3 * 1024 * 1024) {
        return res.status(400).json({ message: 'Each image must be less than 3MB.' });
      }
    }
  }

  next();
};

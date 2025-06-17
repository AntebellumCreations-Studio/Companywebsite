import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const validatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req.body);
  console.log(req.body)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default validatorMiddleware;

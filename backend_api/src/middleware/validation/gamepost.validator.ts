import { check } from 'express-validator';
import validatorMiddleware from '../errors/validation.middleware';

// ✅ GET GamePost by ID
export const getGamePostValidator = [
  check('id').notEmpty().withMessage('Game post id is required').isMongoId().withMessage('Game post id is invalid'),
  validatorMiddleware,
];

// ✅ CREATE GamePost
export const createGamePostValidator = [
  check('title')
    .notEmpty().withMessage('Game post title is required')
    .isString().withMessage('Game post title must be a string'),

  check('content')
    .notEmpty().withMessage('Game post content is required')
    .isString().withMessage('Game post content must be a string'),

  check('userId')
    .isEmpty().withMessage('User ID is not allowed in request body'), // Enforced from req.user

  check('claps')
    .isEmpty().withMessage('Claps is not allowed to be set manually'),

  validatorMiddleware,
];

// ✅ UPDATE GamePost
export const updateGamePostValidator = [
  check('id')
    .notEmpty().withMessage('Game post id is required')
    .isMongoId().withMessage('Game post id is invalid'),

  check('title')
    .optional()
    .isString().withMessage('Game post title must be a string'),

  check('content')
    .optional()
    .isString().withMessage('Game post content must be a string'),

  check('userId')
    .isEmpty().withMessage('User ID is not allowed in request body'),

  check('claps')
    .isEmpty().withMessage('Claps is not allowed to be set manually'),

  validatorMiddleware,
];

// ✅ DELETE GamePost
export const deleteGamePostValidator = [
  check('id').notEmpty().withMessage('Game post id is required').isMongoId().withMessage('Game post id is invalid'),
  validatorMiddleware,
];

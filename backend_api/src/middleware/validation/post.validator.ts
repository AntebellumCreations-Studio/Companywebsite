import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const getPostValidator = [
  check('id').notEmpty().withMessage('Post id is required').isMongoId().withMessage('Post id is invalid'),

  validatorMiddleware,
];

export const createPostValidator = [
  check('title').notEmpty().withMessage('Post title is required').isString(),
  check('content').notEmpty().withMessage('Post content is required'),
  check('author').isEmpty().withMessage('Post author is not allowed'),
  check('claps').isEmpty().withMessage('Post claps is not allowed'),
  validatorMiddleware,
];

export const updatePostValidator = [
  check('id').notEmpty().withMessage('Post id is required').isMongoId().withMessage('Post id is invalid'),
  //   check('title').optional(),
  //   check('content').optional(),
  check('author').isEmpty().withMessage('Post author is not allowed'),
  check('claps').isEmpty().withMessage('Post claps is not allowed'),

  validatorMiddleware,
];

export const deletePostValidator = [
  check('id').notEmpty().withMessage('Post id is required').isMongoId().withMessage('Post id is invalid'),

  validatorMiddleware,
];

// export const getPostsValidator = [
//   check('page').optional().isInt().withMessage('Page must be a number'),
//   check('limit').optional().isInt().withMessage('Limit must be a number'),

//   validatorMiddleware,
// ];

import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Multer } from 'multer';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import { AuthRequest } from '../interfaces/auth.interface';
import { IGamePost } from '../interfaces/game-post.interface';
import { userRoleVerification } from '../middleware/helper.middlewar';
import { uploadMultipleFiles } from '../middleware/helper.middlewar';
import { gamePostService } from '../services/gamepost.service';
import { UserService } from '../services/user.service';
import apiFeatures from '../utils/apiFeatures';
// ✅ consistent casing
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../utils/cloudinary';

interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}

@autoInjectable()
class GamePostController {
  constructor(private readonly gamePostService: gamePostService, private readonly userService: UserService) {}

  public listGamePosts = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    let results = await this.gamePostService.getPosts(req.query);
    res.status(200).json({ results: results.posts?.length, _metadata: results.paginate, data: results.posts });
  });

  public getGamePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let post = await this.gamePostService.getPost(req.params.id);
    if (!post) return next(new HttpException(404, 'No post found'));
    res.status(200).json({ data: post });
  });

  public createGamePost = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const files = req.files as MulterFiles | undefined;

    const coverFiles = files?.cover || [];
    const imageFiles = files?.images || [];

    // Upload cover (single file or empty)
    const uploadedCover = coverFiles.length > 0 ? await uploadMultipleFiles([coverFiles[0].path]) : [];
    // Upload images (multiple files or empty)
    const uploadedImages = imageFiles?.length > 0 ? await uploadMultipleFiles(imageFiles.map(f => f.path)) : [];

    // Prepare your post body
    const postBody = req.body as IGamePost;

    postBody.coverImage = uploadedCover[0] ? { url: uploadedCover[0].secure_url, publicId: uploadedCover[0].public_id } : undefined;

    postBody.images = uploadedImages.length > 0 ? uploadedImages.map(file => ({ url: file.secure_url, publicId: file.public_id })) : [];
    let post = await this.gamePostService.createPost(req.user?._id!, postBody);
    res.status(201).json({ data: post });
  });

  public updateGamePost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const postBody = req.body as IGamePost;

    const files = req.files as MulterFiles | undefined;

    const coverFiles = files?.cover || [];
    const imageFiles = files?.images || [];

    if (coverFiles.length > 0) {
      // Upload cover (single fileor empty)
      const uploadedCover = coverFiles.length > 0 ? await uploadMultipleFiles([coverFiles[0].path]) : [];

      postBody.coverImage = uploadedCover[0] ? { url: uploadedCover[0].secure_url, publicId: uploadedCover[0].public_id } : undefined;
    }
    if (imageFiles.length>0) {
      const uploadedImages = imageFiles?.length > 0 ? await uploadMultipleFiles(imageFiles.map(f => f.path)) : [];
      postBody.images = uploadedImages.length > 0 ? uploadedImages.map(file => ({ url: file.secure_url, publicId: file.public_id })) : [];
    }

    req.body.userId = req.user?._id!;

    let isAllowed = false;
    let user = await this.userService.getUser(req.body.userId);
    if (user) {
      isAllowed = userRoleVerification(user.role, 2);
    }

    let post = await this.gamePostService.updatePost(req.params.id, postBody, isAllowed);
    if (!post) return next(new HttpException(404, 'No post found'));
    res.status(200).json({ data: post });
  });

  public deleteGamePost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let isAllowed = false;
    let user = await this.userService.getUser(req.user?._id!);
    if (user) {
      isAllowed = userRoleVerification(user.role, 2);
    }
    let post = await this.gamePostService.deletePost(req.params.id, req.user?._id!, isAllowed);
    if (!post) return next(new HttpException(404, 'No post found'));
    res.sendStatus(204);
  });
}

export { GamePostController };

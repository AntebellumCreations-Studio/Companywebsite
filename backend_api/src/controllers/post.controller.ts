import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import { AuthRequest } from '../interfaces/auth.interface';
import { PostService } from '../services/post.service';

@autoInjectable()
class PostController {
  constructor(private readonly postService: PostService) {}

  public listPosts = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    let results = await this.postService.getPosts(req.query);
    res.status(200).json({ results: results.posts?.length, _metadata: results.paginate, data: results.posts });
  });

  public getPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let post = await this.postService.getPost(req.params.id);
    if (!post) return next(new HttpException(404, 'No post found'));
    res.status(200).json({ data: post });
  });

  public createPost = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    let post = await this.postService.createPost(req.user?._id!, req.body);
    res.status(201).json({ data: post });
  });

  public updatePost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    req.body.userId = req.user?._id!;
    let post = await this.postService.updatePost(req.params.id, req.body);
    if (!post) return next(new HttpException(404, 'No post found'));
    res.status(200).json({ data: post });
  });

  public deletePost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let post = await this.postService.deletePost(req.params.id, req.user?._id!);
    if (!post) return next(new HttpException(404, 'No post found'));
    res.sendStatus(204);
  });
}

export { PostController };

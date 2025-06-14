import { NextFunction, Request, Response } from 'express';
import { userRoleVerification } from '../middleware/helper.middlewar';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import { AuthRequest } from '../interfaces/auth.interface';
import { gamePostService  } from '../services/gamepost.service';
import { UserService } from '../services/user.service';


@autoInjectable()
class GamePostController {
  constructor(private readonly gamePostService : gamePostService ,
     private readonly userService: UserService
   ) {}

  public listGamePosts = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    let results = await this.gamePostService .getPosts(req.query);
    res.status(200).json({ results: results.posts?.length, _metadata: results.paginate, data: results.posts });
  });

  public getGamePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let post = await this.gamePostService .getPost(req.params.id);
    if (!post) return next(new HttpException(404, 'No post found'));
    res.status(200).json({ data: post });
  });

  public createGamePost = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    let post = await this.gamePostService .createPost(req.user?._id!, req.body);
    res.status(201).json({ data: post });
  });

  public updateGamePost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    req.body.userId = req.user?._id!;
 
    let isAllowed=false;
    let user =  await this.userService.getUser(req.body.UserId);
    if(user){isAllowed = userRoleVerification(user.role,2)}
 
    let post = await this.gamePostService .updatePost(req.params.id, req.body,isAllowed);
    if (!post) return next(new HttpException(404, 'No post found'));
    res.status(200).json({ data: post });
  });

  public deleteGamePost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let isAllowed=false;
    let user =  await this.userService.getUser(req.user?._id!);
    if(user){isAllowed = userRoleVerification(user.role,2)}
    let post = await this.gamePostService .deletePost(req.params.id, req.user?._id!,isAllowed);
    if (!post) return next(new HttpException(404, 'No post found'));
    res.sendStatus(204);
  });
}

export { GamePostController };

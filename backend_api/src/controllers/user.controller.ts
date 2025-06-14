import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import { AuthRequest } from '../interfaces/auth.interface';
import { UserService } from '../services/user.service';

@autoInjectable()
class UserController {
  constructor(private readonly userService: UserService) {}
  // logged in user
  public getLoggedUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    res.status(200).json({ data: req.user });
  });

  public updateLoggedUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    let user = await this.userService.updateUser(req.user?._id!, req.body);
    res.status(200).json({ data: user });
  });

  public deleteLoggedUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.userService.deleteUser(req.user?._id!);
    res.sendStatus(204);
  });

  public updateProfileImage = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    if (!req.file) return next(new HttpException(400, 'Please upload a file'));

    let user = this.userService.updateProfileImage(userId!, req.file);
    if (!user) return next(new HttpException(404, 'No user found'));
    res.status(200).json({ data: user });
  });

  public getFollowing = asyncHandler(async (req: AuthRequest, res: Response) => {
    let userId: string;
    // Check if the route includes ':id'
    if (req.params.id) {
      userId = req.params.id;
    } else {
      // If the route is '/me/followers', use the authenticated user's ID
      userId = req.user!._id!;
    }
    let results = await this.userService.getFollowing(userId!);
    res.status(200).json({ results: results?.following?.length, data: results });
  });

  public getFollowers = asyncHandler(async (req: AuthRequest, res: Response) => {
    let userId;
    // Check if the route includes ':id'
    if (req.params.id) {
      userId = req.params.id;
    } else {
      // If the route is '/me/followers', use the authenticated user's ID
      userId = req.user?._id;
    }

    let results = await this.userService.getFollowers(userId!);
    res.status(200).json({ results: results?.followers?.length, data: results });
  });

  public followUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    let user = await this.userService.followUser(req.user?._id!, req.body.userId);
    res.status(200).json({ data: user });
  });

  public unfollowUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    let user = await this.userService.unfollowUser(req.user?._id!, req.body.userId);
    res.status(200).json({ data: user });
  });

  /**********************************
   *
   *    Admin
   *
   **********************************/
  public getUsers = asyncHandler(async (req: Request, res: Response) => {
    let results = await this.userService.getUsers(req.query);
    res.status(200).json({ results: results.users?.length, _metadata: results.paginate, data: results.users });
  });

  public getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let user = await this.userService.getUser(req.params.id);
    if (!user) return next(new HttpException(404, 'No user found'));
    res.status(200).json({ data: user });
  });

  public createUser = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    let user = await this.userService.createUser(req.body);
    res.status(201).json({ data: user });
  });

  public updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let user = await this.userService.updateUser(req.params.id, req.body);
    if (!user) return next(new HttpException(404, 'No user found'));
    res.status(200).json({ data: user });
  });

  public deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let user = await this.userService.deleteUser(req.params.id);
    if (!user) return next(new HttpException(404, 'No user found'));
    res.sendStatus(204);
  });
}

export { UserController };

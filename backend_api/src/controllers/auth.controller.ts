import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import asyncHandler from 'express-async-handler';

import { AuthServie } from '../services/auth.service';

// TODO: use passport.js for authentication

@autoInjectable()
export class AuthController {
  constructor(private readonly authService: AuthServie) {}

  public signup = asyncHandler(async (req: Request, res: Response) => {
    let { user, token } = await this.authService.signup(req.body);
    const userData = { _id: user._id, email: user.email, username: user.username };
    res.status(201).json({ data: userData, token });
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    let { emailOrUsername, password } = req.body;
    let { user, token } = await this.authService.login(emailOrUsername, password);

    const userData = { _id: user._id, email: user.email, username: user.username };
    res.status(200).json({ data: userData, token });
  });
}

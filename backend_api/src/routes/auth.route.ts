import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { AuthController } from '../controllers/auth.controller';
import { Routes } from '../interfaces/routes.interface';
import { loginValidator, signupValidator } from '../middleware/validation';
import multer from 'multer';
const upload = multer();

@autoInjectable()
export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();

  constructor(private readonly authController: AuthController) {
    this.initializerRoutes();
  }

  private initializerRoutes() {
    this.router.post(`${this.path}/signup`,upload.none(), signupValidator, this.authController.signup);
    this.router.post(`${this.path}/login`,upload.none(), loginValidator, this.authController.login);
  }
}

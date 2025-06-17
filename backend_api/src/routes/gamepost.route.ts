import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { GamePostController } from '../controllers/gamepost.controller';

import { authenticateUser } from '../middleware/auth.middleware';
import { postImageUpload } from '../middleware/uploadImages.middleware';
import {
  createGamePostValidator,
  deleteGamePostValidator,
  getGamePostValidator,
  updateGamePostValidator,
} from '../middleware/validation/gamepost.validator';
import { gamePostFileValidator } from '../middleware/validation/gamepostfile.validator';

@autoInjectable()
class GamePostRoute {
  public path = '/game';
  public router = Router({ mergeParams: true });

  constructor(private readonly gamePostController: GamePostController) {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    // public routes
    this.router.get(`${this.path}`, this.gamePostController.listGamePosts);
    this.router.route(`${this.path}/:id`).get(getGamePostValidator, this.gamePostController.getGamePost);

    // protected routes
    this.router.use(`${this.path}`, authenticateUser);
    this.router.post(
      `${this.path}`,
      postImageUpload.array('images', 10),
      gamePostFileValidator,
      createGamePostValidator,
      this.gamePostController.createGamePost
    );
    this.router
      .route(`${this.path}/:id`)
      .patch(updateGamePostValidator, postImageUpload.array('images', 10), gamePostFileValidator, this.gamePostController.updateGamePost)
      .delete(deleteGamePostValidator, this.gamePostController.deleteGamePost);

    // .put(this.postController.updatePost).delete(this.postController.deletePost);
  }
}

export { GamePostRoute };

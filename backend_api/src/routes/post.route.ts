import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { PostController } from '../controllers/post.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { createPostValidator, deletePostValidator, getPostValidator, updatePostValidator } from '../middleware/validation/post.validator';

@autoInjectable()
class PostRoute {
  public path = '/posts';
  public router = Router({ mergeParams: true });

  constructor(private readonly postController: PostController) {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    // public routes
    this.router.get(`${this.path}`, this.postController.listPosts);
    this.router.route(`${this.path}/:id`).get(getPostValidator, this.postController.getPost);

    // protected routes
    this.router.use(`${this.path}`, authenticateUser);
    this.router.post(`${this.path}`, createPostValidator, this.postController.createPost);
    this.router
      .route(`${this.path}/:id`)
      .patch(updatePostValidator, this.postController.updatePost)
      .delete(deletePostValidator, this.postController.deletePost);

    // .put(this.postController.updatePost).delete(this.postController.deletePost);
  }
}

export { PostRoute };

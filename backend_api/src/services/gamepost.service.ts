import { autoInjectable } from 'tsyringe';

import { gamePostDao } from '../DB/dao/gamePost.doa';

import HttpException from '../exceptions/HttpException';
import { IGamePost } from '../interfaces/game-post.interface';
import { IPagination } from '../interfaces/respons.interface';
import { cloudinaryDeleteImage } from '../utils/cloudinary';
import APIFeatures from '../utils/apifeatures';

// ✅ consistent casing

@autoInjectable()
class gamePostService {
  constructor(private readonly gamePostDao: gamePostDao) {}

  public getPosts = async (
    reqQuery: any
  ): Promise<{
    posts: IGamePost[] | null;
    paginate: IPagination;
  }> => {
    let apiFeatures = new APIFeatures(reqQuery);
    let query = apiFeatures.filter();
    let paginate = apiFeatures.paginate();
    let sort = apiFeatures.sort();
    let fields = apiFeatures.selectFields();
    // search by keyword
    if (reqQuery.keyword) {
      query = { ...query, $or: [{ content: { $regex: reqQuery.keyword, $options: 'i' } }, { title: { $regex: reqQuery.keyword, $options: 'i' } }] };
    }

    let countPosts = await this.gamePostDao.countPosts(query);

    if (countPosts) paginate = apiFeatures.paginate(countPosts); // update the pagination object with the total documents

    let posts = await this.gamePostDao.listPosts(query, paginate, sort, fields);

    return { posts, paginate };
  };

  public getPost = async (id: string): Promise<IGamePost | null> => {
    return await this.gamePostDao.getPost(id);
  };

  public createPost = async (userId: string, post: IGamePost): Promise<IGamePost | null> => {
    post.userId = userId as any;

    return await this.gamePostDao.createPost(post);
  };

public updatePost = async (
  id: string,
  post: IGamePost,
  hasHighPermission: boolean = false
): Promise<IGamePost | null> => {
  const oldPost = await this.gamePostDao.getPost(id);
  if (!oldPost) return null;

  // Permission check
  if (!hasHighPermission) {
    if (oldPost.userId.toString() !== post.userId.toString()) {
      throw new HttpException(403, 'You are not authorized to update this post');
    }
  }

  // If new cover image is uploaded, delete the old one
  if (post.coverImage?.publicId && oldPost.coverImage?.publicId) {
    await cloudinaryDeleteImage(oldPost.coverImage.publicId);
  }

  // Combine old images and new ones
  if (post.images?.length) {
    const oldImages = oldPost.images ?? [];
    const combinedImages = [...oldImages, ...post.images];

    // Remove duplicates based on publicId (optional but recommended)
    const uniqueImages = Array.from(
      new Map(combinedImages.map(img => [img.publicId, img])).values()
    );

    post.images = uniqueImages;
  } else {
    // If no new images, keep old ones
    post.images = oldPost.images;
  }

  return await this.gamePostDao.updatePost(id, post);
};

 public deletePost = async (
  id: string,
  userId: string,
  hasHighPermission: boolean = false
): Promise<IGamePost | null> => {
  const oldPost = await this.gamePostDao.getPost(id);
  if (!oldPost) return null;

  // Permission check
  if (!hasHighPermission) {
    if (String(oldPost.userId) !== String(userId)) {
      throw new HttpException(403, 'You are not authorized to delete this post');
    }
  }

  // Delete cover image if exists
  if (oldPost.coverImage?.publicId) {
    await cloudinaryDeleteImage(oldPost.coverImage.publicId);
  }

  // Delete all attached images if exist
if (oldPost?.images) {
  if (oldPost.images?.length > 0) {
    const deletePromises = oldPost.images
      .filter(img => img.publicId)
      .map(img => cloudinaryDeleteImage(img.publicId!));
    await Promise.all(deletePromises);
  }
  }


  // Delete the post itself
  return await this.gamePostDao.deletePost(id);
};

}

export { gamePostService };

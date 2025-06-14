import { autoInjectable } from 'tsyringe';

import { PostDao } from '../DB/dao/post.dao';
import HttpException from '../exceptions/HttpException';
import { IPost, IPostUpdate } from '../interfaces/post.interface';
import { IPagination } from '../interfaces/respons.interface';
import APIFeatures from '../utils/apiFeatures';

@autoInjectable()
class PostService {
  constructor(private readonly postDao: PostDao) {}

  public getPosts = async (
    reqQuery: any
  ): Promise<{
    posts: IPost[] | null;
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

    let countPosts = await this.postDao.countPosts(query);

    if (countPosts) paginate = apiFeatures.paginate(countPosts); // update the pagination object with the total documents

    let posts = await this.postDao.listPosts(query, paginate, sort, fields);

    return { posts, paginate };
  };

  public getPost = async (id: string): Promise<IPost | null> => {
    return await this.postDao.getPost(id);
  };

  public createPost = async (userId: string, post: IPost): Promise<IPost | null> => {
    post.userId = userId as any;
    return await this.postDao.createPost(post);
  };

  public updatePost = async (id: string, post: IPostUpdate): Promise<IPost | null> => {
    let oldPost = await this.postDao.getPost(id);
    if (!oldPost) return null;
    if (oldPost?.userId.toString() !== post.userId.toString()) throw new HttpException(403, 'You are not authorized to update this post');
    return await this.postDao.updatePost(id, post);
  };

  public deletePost = async (id: string, userId: string): Promise<IPost | null> => {
    let oldPost = await this.postDao.getPost(id);
    if (!oldPost) return null;
    if (oldPost?.userId !== (userId as any)) throw new HttpException(403, 'You are not authorized to update this post');
    return await this.postDao.deletePost(id);
  };
}

export { PostService };

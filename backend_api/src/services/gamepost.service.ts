import { autoInjectable } from 'tsyringe';

import {gamePostDao} from '../DB/dao/gamePost.doa';
import GamePostModel from '../DB/models/gamePost.model';
import { IGamePost } from '../interfaces/game-post.interface';
import { IPagination } from '../interfaces/respons.interface';
import HttpException from '../exceptions/HttpException';
import APIFeatures from '../utils/apiFeatures';



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

  public updatePost = async (id: string, post: IGamePost,hasHighPermission:boolean=false): Promise<IGamePost | null> => {
    let oldPost = await this.gamePostDao.getPost(id);
    if (!oldPost) return null;
    if (!hasHighPermission) {if (oldPost?.userId.toString() !== post.userId.toString()) throw new HttpException(403, 'You are not authorized to update this post');}
    return await this.gamePostDao.updatePost(id, post);
  };

  public deletePost = async (id: string, userId: string,hasHighPermission:boolean=false): Promise<IGamePost | null> => {
    let oldPost = await this.gamePostDao.getPost(id);
    if (!oldPost) return null;
    if (!hasHighPermission) { if (oldPost?.userId !== (userId as any)) throw new HttpException(403, 'You are not authorized to update this post');}
    return await this.gamePostDao.deletePost(id);
  };
}

export { gamePostService};

import { IGamePost } from '../../interfaces/game-post.interface';
import gamePostModel from '../models/gamePost.model';

class gamePostDao {
  async getPost(id: string): Promise<IGamePost | null> {
    return await gamePostModel.findById(id).lean();
  }
  async listPosts(query: any, paginate: { skip: number; limit: number }, sort: any = {}, select: any = '-__v'): Promise<IGamePost[] | null> {
    // build the query
    let posts = gamePostModel.find(query);
    console.log(paginate.skip, paginate.limit);
    if (paginate.skip) posts = posts.skip(paginate.skip);
    if (paginate.limit) posts = posts.limit(paginate.limit);
    posts = posts.sort(sort).select(select);
    // execute the query

    let results = await posts.lean(); // lean() to return plain js object instead of mongoose document
    return results;
  }

  async countPosts(query: any): Promise<number> {
    return await gamePostModel.countDocuments(query);
  }

  async createPost(post: IGamePost): Promise<IGamePost | null> {
    return await gamePostModel.create(post);
  }

  async updatePost(id: string, post: IGamePost): Promise<IGamePost | null> {
    return await gamePostModel.findByIdAndUpdate(id, post, { new: true }).lean();
  }

  async deletePost(id: string): Promise<IGamePost | null> {
    return await gamePostModel.findByIdAndDelete(id).lean();
  }
}

export { gamePostDao };

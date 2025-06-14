import { IPost, IPostUpdate } from '../../interfaces/post.interface';
import PostModel from '../models/post.model';

class PostDao {
  async getPost(id: string): Promise<IPost | null> {
    return await PostModel.findById(id).lean();
  }
  async listPosts(query: any, paginate: { skip: number; limit: number }, sort: any = {}, select: any = '-__v'): Promise<IPost[] | null> {
    // build the query
    let posts = PostModel.find(query);
    console.log(paginate.skip, paginate.limit);
    if (paginate.skip) posts = posts.skip(paginate.skip);
    if (paginate.limit) posts = posts.limit(paginate.limit);
    posts = posts.sort(sort).select(select);
    // execute the query

    let results = await posts.lean(); // lean() to return plain js object instead of mongoose document
    return results;
  }

  async countPosts(query: any): Promise<number> {
    return await PostModel.countDocuments(query);
  }

  async createPost(post: IPost): Promise<IPost | null> {
    return await PostModel.create(post);
  }

  async updatePost(id: string, post: IPostUpdate): Promise<IPost | null> {
    return await PostModel.findByIdAndUpdate(id, post, { new: true }).lean();
  }

  async deletePost(id: string): Promise<IPost | null> {
    return await PostModel.findByIdAndDelete(id).lean();
  }
}

export { PostDao };

import { Document, ObjectId } from 'mongoose';

import { IComment } from './comment.interface';

export interface IPost {
  title: string;
  content: string;
  userId: ObjectId;
  claps: ObjectId[];
  comments: IComment[];
  postType:number
}

// export interface IPostQuery extends IPost {
//   page?: number;
//   limit?: number;
// }

export interface IPostDocument extends IPost, Document {}
export interface IPostUpdate {
  userId: string;
  title?: string;
  content?: string;
}

export interface IUserUpdatePassword {
  password: string;
}

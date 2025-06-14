import { ObjectId } from 'mongoose';

export interface IComment {
  content: string;
  postId: ObjectId;
  userId: ObjectId;
}

export interface ICommentDocument extends IComment, Document {}

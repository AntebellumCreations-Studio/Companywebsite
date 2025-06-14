import { Document, ObjectId } from 'mongoose';
import { IComment } from './comment.interface';

export interface IServicePost {
  title: string;
  content: string;
  userId: ObjectId;
  claps: ObjectId[];
  comments: IComment[];
  serviceImages:string[];
  postType: number; // e.g. 0 = web dev, 1 = consulting, etc.
  category: string;
  pricing: string;
  contactEmail: string;
  features: string[];
}

export interface IServicePostDocument extends IServicePost, Document {}

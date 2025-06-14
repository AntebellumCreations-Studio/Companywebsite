import { Document, ObjectId } from 'mongoose';
import { IComment } from './comment.interface';

export interface IGamePost {
  title: string;
  content: string;
  userId: ObjectId;
  claps: ObjectId[];
  comments: IComment[];
  postType: number; // e.g. 0 = devlog, 1 = feature update, etc.
  gameTitle: string;
  genre: string;
  coverImage: string;
  images: string[]; // URLs to images
  trailerUrl?: string;   // Optional link to gameplay video or trailer
  releaseDate?: Date|string;
}

export interface IGamePostDocument extends IGamePost, Document {}

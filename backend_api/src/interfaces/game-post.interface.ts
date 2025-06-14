import { Document, ObjectId } from 'mongoose';
import { IComment } from './comment.interface';

export interface ImageObject {
  url: string;
  publicId: string | null;
}

export interface IGamePost {
  title: string;
  content: string;
  userId: ObjectId;
  claps: ObjectId[];
  comments: IComment[]; // or store comment IDs if you're not embedding
  postType: number; // e.g., 0 = devlog, 1 = feature update
  gameTitle: string;
  genre: string[];
  coverImage?: ImageObject;
  images?: ImageObject[];
  trailerUrl?: string;
  releaseDate?: Date | string;
}

export interface IGamePostDocument extends IGamePost, Document {}

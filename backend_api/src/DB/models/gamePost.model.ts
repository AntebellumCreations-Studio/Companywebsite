import { Schema,  model } from 'mongoose';
import { IGamePostDocument } from '../../interfaces/game-post.interface';

const ImageObjectSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: null },
  },
  { _id: false } // Prevent Mongoose from adding _id to subdocs unnecessarily
);

const GamePostSchema = new Schema<IGamePostDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    claps: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    postType: { type: Number, default: 0, required: true },
    comments: [
      {
        commentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
      },
    ],
    gameTitle: { type: String, required: true },
    genre:[ { type: String, required: true }],
   coverImage: { type: ImageObjectSchema },
    images: [ImageObjectSchema],
    trailerUrl: { type: String },
    releaseDate: { type: Schema.Types.Mixed},
  },
  { timestamps: true }
);

const GamePostModel = model<IGamePostDocument>('GamePost', GamePostSchema);
export default GamePostModel;

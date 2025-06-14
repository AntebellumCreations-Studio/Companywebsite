import { Schema, model } from 'mongoose';

import { ICommentDocument } from '../../interfaces/comment.interface';

const CommentSchema: Schema<ICommentDocument> = new Schema(
  {
    content: { type: String, required: true },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const CommentModel = model<ICommentDocument>('Comment', CommentSchema);

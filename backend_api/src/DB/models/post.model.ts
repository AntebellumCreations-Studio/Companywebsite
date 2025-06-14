import { Schema, model } from 'mongoose';

import { IPostDocument } from '../../interfaces/post.interface';

let PostSchema: Schema<IPostDocument> = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    claps: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    postType:{type:Number,default: 0,required: true},
    comments: [
      {
        commnetId: { type: Schema.Types.ObjectId, ref: 'Comment' },
      },
    ],
  },
  { timestamps: true }
);

let PostModel = model<IPostDocument>('Post', PostSchema);

export default PostModel;

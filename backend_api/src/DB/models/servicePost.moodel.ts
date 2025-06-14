import { Schema, model } from 'mongoose';
import { IServicePostDocument } from '../../interfaces/service-post.interface';

const ServicePostSchema = new Schema<IServicePostDocument>(
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
    category: { type: String, required: true },
    pricing: { type: String, required: true },
    contactEmail: { type: String, required: true },
    features: [{ type: String }],
    serviceImages: [{ type: String }],

  },
  { timestamps: true }
);

const ServicePostModel = model<IServicePostDocument>('ServicePost', ServicePostSchema);
export default ServicePostModel;

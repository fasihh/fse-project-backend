import mongoose, { Document } from "mongoose";

export interface ICommunity {
  title: string;
  description: string;
  postIds: mongoose.Schema.Types.ObjectId[];
  moderatorIds: mongoose.Schema.Types.ObjectId[];
};

export interface ICommunityDocument extends ICommunity, Document {
  addPost(postId: mongoose.Types.ObjectId): Promise<void>;
  deletePost(postId: mongoose.Types.ObjectId): Promise<void>;
};

const communitySchema = new mongoose.Schema<ICommunityDocument>({
  _id: mongoose.Schema.ObjectId,
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ""
  },
  postIds: {
    type: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }],
    default: []
  },
  moderatorIds: {
    type: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    default: []
  }
}, {
  versionKey: false,
  timestamps: true
});

communitySchema.methods.addPost = async function(postId: mongoose.Types.ObjectId) {
  this.postIds.push(postId);
  await this.save();
}

communitySchema.methods.deletePost = async function(postId: mongoose.Types.ObjectId) {
  this.postIds.pull(postId);
  await this.save();
}

export const Community = mongoose.model('Community', communitySchema);

import mongoose, { Document } from "mongoose";
import { PostFile } from "../types/global";


export interface IPost {
    communityId: mongoose.Schema.Types.ObjectId;
    commentIds: mongoose.Schema.Types.ObjectId[];
    title: string;
    content: string;
    files: PostFile[];
    likes: number;
    creatorId: mongoose.Schema.Types.ObjectId;
}

export interface IPostDocument extends IPost, Document {
    addComment(commentId: mongoose.Types.ObjectId): Promise<void>;
    deleteComment(commentId: mongoose.Types.ObjectId): Promise<void>;
};

const postSchema = new mongoose.Schema<IPostDocument>({
    communityId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Community',
    },
    commentIds: {
        type: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
        default: [],
    },
    title: {
        type: String,
        default: "",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    files: {
        type: [Object],
        default: [],
    },
    likes: {
        type: Number,
        default: 0
    },
    creatorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }
}, {
    versionKey: false,
    timestamps: true,
});

postSchema.methods.addComment = async function(commentId: mongoose.Types.ObjectId) {
    this.commentIds.push(commentId);
    await this.save();
}

postSchema.methods.deleteComment = async function(commentId: mongoose.Types.ObjectId) {
    this.commentIds.pull(commentId);
    await this.save();
}


export const Post = mongoose.model('Post', postSchema);
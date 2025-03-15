import mongoose, { Document } from "mongoose";
import { PostFile } from "../types/global";


export interface IPost {
    communityId: mongoose.Schema.Types.ObjectId;
    commentsId: mongoose.Schema.Types.ObjectId[];
    title: string;
    content: string;
    files: PostFile[];
    likes: number;
    creatorId: mongoose.Schema.Types.ObjectId;
}

export interface IPostDocument extends IPost, Document {

};

const PostSchema = new mongoose.Schema<IPostDocument>({
    communityId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Community',
    },
    commentsId: {
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
}
)

export const Post = mongoose.model('Post', PostSchema);
import mongoose, { Document } from "mongoose";


export interface IComment {
    postId: mongoose.Schema.Types.ObjectId;
    creatorId: mongoose.Schema.Types.ObjectId;
    content: string;
    likes: number;
    replyIds: mongoose.Schema.Types.ObjectId[];
}

export interface ICommentDocument extends IComment, Document {

}

const CommentSchema = new mongoose.Schema<ICommentDocument>({
    postId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
    },
    creatorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    content: {
        type: String,
        default: "",
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    replyIds: {
        type: [{ type: mongoose.Schema.ObjectId, ref: 'Reply'}],
        default: []
    }
}, {
    versionKey: false,
    timestamps: true,
})

export const Comment = mongoose.model('Comment', CommentSchema)
import mongoose, { Document } from "mongoose";

export interface IReply {
    commentId: mongoose.Schema.Types.ObjectId;
    creatorId: mongoose.Schema.Types.ObjectId;
    content: string;
    likes: number;
    postId: mongoose.Schema.Types.ObjectId;
}
export interface IReplyDocument extends IReply, Document {

}

const replySchema = new mongoose.Schema<IReplyDocument>({
    commentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment',
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
    postId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
    },
}, {
    versionKey: false,
    timestamps: true,
})

export const Reply = mongoose.model('Reply', replySchema)
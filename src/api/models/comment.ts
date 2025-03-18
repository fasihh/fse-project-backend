import mongoose, { Document } from "mongoose";


export interface IComment {
    postId: mongoose.Schema.Types.ObjectId;
    creatorId: mongoose.Schema.Types.ObjectId;
    content: string;
    likes: number;
    replyIds: mongoose.Schema.Types.ObjectId[];
}

export interface ICommentDocument extends IComment, Document {
    addReply(replyId: mongoose.Types.ObjectId): Promise<void>;
    deleteReply(replyId: mongoose.Types.ObjectId): Promise<void>;
}

const commentSchema = new mongoose.Schema<ICommentDocument>({
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
});

commentSchema.methods.addReply = async function(replyId: mongoose.Types.ObjectId) {
    this.replyIds.push(replyId);
    await this.save();
}

commentSchema.methods.deleteReply = async function(replyId: mongoose.Types.ObjectId) {
    this.replyIds.pull(replyId);
    await this.save();
}

export const Comment = mongoose.model('Comment', commentSchema)
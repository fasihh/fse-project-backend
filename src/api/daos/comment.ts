import { Comment, IComment, ICommentDocument } from "../models/comment";

class CommentDAO {
    async find() {
        return await Comment.find();
    }

    async findById(id: string) {
        return await Comment.findOne({ _id: id });
    }

    async findByPostId(id: string) {
        return await Comment.find({ postId: id });
    }

    async create(comment: ICommentDocument) {
        await comment.save();
    }

    async updateById(id: string, comment: Partial<IComment>) {
        await Comment.updateOne({ _id: id }, { $set: comment })
    }

    async deleteById(id: string) {
        await Comment.deleteOne({ _id: id });
    }
}

export default new CommentDAO;
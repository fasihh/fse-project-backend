import { IReply, IReplyDocument, Reply } from "../models/reply";


class ReplyDAO {
    async find() {
        return await Reply.find();
    }

    async findById(id: string) {
        return await Reply.findOne({ _id: id });
    }

    async findByCommentId(id: string) {
        return await Reply.findOne({ commentId: id });
    }

    async create(reply: IReplyDocument) {
        await reply.save();
    }

    async updateById(id: string, comment: Partial<IReply>) {
        await Reply.updateOne({ _id: id }, { $set: comment })
    }

    async deleteById(id: string) {
        await Reply.deleteOne({ _id: id });
    }
}

export default new ReplyDAO;
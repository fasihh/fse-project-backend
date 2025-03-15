import { Post, IPost, IPostDocument } from "../models/post";

class PostDAO {
    async find() {
        return await Post.find()
    }

    async findById(id: string) {
        return await Post.findOne({ _id: id });
    }

    async create(post: IPostDocument) {
        await post.save();
    }

    async updateById(id: string, post: Partial<IPost>) {
        await Post.updateOne({ _id: id }, { $set: post });
    }

    async deleteById(id: string) {
        await Post.deleteOne({ _id: id });
    }
}

export default new PostDAO;
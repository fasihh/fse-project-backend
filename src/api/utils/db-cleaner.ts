import mongoose from 'mongoose';
import { User } from '../models/user';
import { Post } from '../models/post';
import { Comment } from '../models/comment';
import { Reply } from '../models/reply';
import { Community } from '../models/community';

export const cleanDatabase = async () => {
    try {
        // Delete all documents from each collection
        await Promise.all([
            User.deleteMany({}),
            Post.deleteMany({}),
            Comment.deleteMany({}),
            Reply.deleteMany({}),
            Community.deleteMany({})
        ]);

        console.log('Successfully cleaned all collections');
        console.log('Collections cleaned:');
        console.log('- Users');
        console.log('- Posts');
        console.log('- Comments');
        console.log('- Replies');
        console.log('- Communities');
    } catch (error) {
        console.error('Error cleaning database:', error);
        throw error;
    }
} 
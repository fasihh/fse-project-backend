'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // USERS
    await queryInterface.bulkInsert('User', [
      {
        id: 1,
        username: 'admin',
        displayName: 'Admin User',
        email: 'admin@example.com',
        password: '$2b$10$abcdefghijklmnopqrstuv', // bcrypt hash placeholder
        role: 'admin',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ...Array.from({ length: 20 }).map((_, i) => ({
        id: i + 2,
        username: `user${i + 1}`,
        displayName: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: '$2b$10$abcdefghijklmnopqrstuv',
        role: 'member',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ]);

    // COMMUNITIES
    await queryInterface.bulkInsert('Community', [
      {
        id: 1,
        name: 'General',
        description: 'General community',
        tags: 'general,all',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Tech',
        description: 'Tech community',
        tags: 'tech,programming',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Gaming',
        description: 'Gaming community',
        tags: 'games,fun',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // COMMUNITY MEMBERS
    await queryInterface.bulkInsert('CommunityMember', [
      ...Array.from({ length: 20 }).map((_, i) => ({
        id: i + 1,
        communityId: (i % 3) + 1,
        userId: i + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      // Make admin a member of the other two communities (if not already)
      ...[2, 3].map((cid, idx) => ({
        id: 21 + idx,
        communityId: cid,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ]);

    // POSTS
    await queryInterface.bulkInsert('Post', [
      ...Array.from({ length: 40 }).map((_, i) => ({
        id: i + 1,
        title: `Post Title ${i + 1}`,
        content: `This is the content of post ${i + 1}.`,
        userId: ((i % 20) + 2), // users 2-21
        communityId: ((i % 3) + 1),
        isPinned: i % 7 === 0,
        isPending: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      // Admin posts
      ...Array.from({ length: 3 }).map((_, i) => ({
        id: 41 + i,
        title: `Admin Post ${i + 1}`,
        content: `Admin's post content ${i + 1}`,
        userId: 1,
        communityId: i + 1,
        isPinned: true,
        isPending: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ]);

    // POST FILES
    await queryInterface.bulkInsert('PostFile', [
      ...Array.from({ length: 20 }).map((_, i) => ({
        id: i + 1,
        postId: ((i % 40) + 1),
        path: `uploads/file${i + 1}.txt`,
        size: 1000 + i * 100,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ]);

    // POST VOTES
    await queryInterface.bulkInsert('PostVote', [
      ...Array.from({ length: 60 }).map((_, i) => ({
        id: i + 1,
        postId: ((i % 43) + 1),
        userId: ((i % 21) + 1),
        voteType: i % 2 === 0 ? 'up' : 'down',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ]);

    // COMMENTS
    await queryInterface.bulkInsert('Comment', [
      ...Array.from({ length: 80 }).map((_, i) => ({
        id: i + 1,
        content: `This is comment ${i + 1}`,
        userId: ((i % 21) + 1),
        postId: ((i % 43) + 1),
        parentId: i > 0 && i % 5 === 0 ? i : null, // every 5th comment is a parent
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ]);

    // COMMENT VOTES
    await queryInterface.bulkInsert('CommentVote', [
      ...Array.from({ length: 100 }).map((_, i) => ({
        id: i + 1,
        commentId: ((i % 80) + 1),
        userId: ((i % 21) + 1),
        voteType: i % 2 === 0 ? 'up' : 'down',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ]);

    // USER FRIENDS
    await queryInterface.bulkInsert('UserFriend', [
      ...Array.from({ length: 20 }).map((_, i) => ({
        id: i + 1,
        userId: 1,
        friendId: i + 2,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      ...Array.from({ length: 20 }).map((_, i) => ({
        id: 21 + i,
        userId: i + 2,
        friendId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserFriend', null, {});
    await queryInterface.bulkDelete('CommentVote', null, {});
    await queryInterface.bulkDelete('Comment', null, {});
    await queryInterface.bulkDelete('PostVote', null, {});
    await queryInterface.bulkDelete('PostFile', null, {});
    await queryInterface.bulkDelete('Post', null, {});
    await queryInterface.bulkDelete('CommunityMember', null, {});
    await queryInterface.bulkDelete('Community', null, {});
    await queryInterface.bulkDelete('User', null, {});
  }
};

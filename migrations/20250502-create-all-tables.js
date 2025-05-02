'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // USER
    await queryInterface.createTable('User', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      displayName: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM('member', 'admin'), allowNull: false, defaultValue: 'member' },
      isVerified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // COMMUNITY
    await queryInterface.createTable('Community', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.STRING, allowNull: false },
      tags: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // COMMUNITY MEMBER
    await queryInterface.createTable('CommunityMember', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      communityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Community', key: 'id' },
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // POST
    await queryInterface.createTable('Post', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE'
      },
      communityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Community', key: 'id' },
        onDelete: 'CASCADE'
      },
      isPinned: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      isPending: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // POST FILE
    await queryInterface.createTable('PostFile', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Post', key: 'id' },
        onDelete: 'CASCADE'
      },
      path: { type: Sequelize.STRING, allowNull: false },
      size: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // POST VOTE
    await queryInterface.createTable('PostVote', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Post', key: 'id' },
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE'
      },
      voteType: { type: Sequelize.ENUM('up', 'down'), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // COMMENT
    await queryInterface.createTable('Comment', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      content: { type: Sequelize.TEXT, allowNull: false },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE'
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Post', key: 'id' },
        onDelete: 'CASCADE'
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Comment', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // COMMENT VOTE
    await queryInterface.createTable('CommentVote', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      commentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Comment', key: 'id' },
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE'
      },
      voteType: { type: Sequelize.ENUM('up', 'down'), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // USER FRIEND
    await queryInterface.createTable('UserFriend', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE'
      },
      friendId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserFriend');
    await queryInterface.dropTable('CommentVote');
    await queryInterface.dropTable('Comment');
    await queryInterface.dropTable('PostVote');
    await queryInterface.dropTable('PostFile');
    await queryInterface.dropTable('Post');
    await queryInterface.dropTable('CommunityMember');
    await queryInterface.dropTable('Community');
    await queryInterface.dropTable('User');
  }
};

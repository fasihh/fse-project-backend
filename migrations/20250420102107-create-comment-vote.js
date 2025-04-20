'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('CommentVote', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      commentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Comment',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      voteType: {
        type: Sequelize.ENUM('up', 'down'),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('CommentVote', ['commentId', 'userId'], {
      unique: true,
    });

    await queryInterface.addConstraint('CommentVote', {
      type: 'unique',
      fields: ['commentId', 'userId'],
      name: 'comment_vote_unique',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('CommentVote');
  }
};

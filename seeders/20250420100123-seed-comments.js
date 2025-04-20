'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Comment', [
      {
        content: 'This is a comment',
        postId: 1,
        userId: 2,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'This is a nested comment',
        postId: 1,
        userId: 2,
        parentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'This is another nested comment',
        postId: 1,
        userId: 1,
        parentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comment', null, {});
    await queryInterface.sequelize.query('TRUNCATE TABLE "Comment" RESTART IDENTITY CASCADE;');
  }
};

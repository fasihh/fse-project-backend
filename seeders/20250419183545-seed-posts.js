'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Post', [
      {
        title: 'First Post',
        content: 'This is the first post',
        userId: 2,
        communityId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Second Post',
        content: 'This is the second post',
        userId: 1,
        communityId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Post', null, {});
    await queryInterface.sequelize.query('TRUNCATE TABLE "Post" RESTART IDENTITY CASCADE;');
  }
};

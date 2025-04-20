'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('PostVote', [
      {
        postId: 1,
        userId: 1,
        voteType: 'up',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 1,
        userId: 2,
        voteType: 'down',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PostVote', null, {});
    await queryInterface.sequelize.query('TRUNCATE TABLE "PostVote" RESTART IDENTITY CASCADE;');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('UserFriend', [
      {
        userId: 1,
        friendId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        friendId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserFriend', null, {});
    await queryInterface.sequelize.query('TRUNCATE TABLE "UserFriend" RESTART IDENTITY CASCADE;');
  }
};

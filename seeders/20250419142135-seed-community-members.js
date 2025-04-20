'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('CommunityMember', [
      {
        userId: 1,
        communityId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        communityId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CommunityMember', null, {});
    await queryInterface.sequelize.query('TRUNCATE TABLE "CommunityMember" RESTART IDENTITY CASCADE;');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Community', [
      {
        name: 'Community 1',
        description: 'Description 1',
        tags: 'Tag1,Tag2,Tag3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Community 2',
        description: 'Description 2',
        tags: 'Tag4,Tag5,Tag6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Community 3',
        description: 'Description 3',
        tags: 'Tag7,Tag8,Tag9',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Community', null, {});
    await queryInterface.sequelize.query('TRUNCATE TABLE "Community" RESTART IDENTITY CASCADE;');
  }
};

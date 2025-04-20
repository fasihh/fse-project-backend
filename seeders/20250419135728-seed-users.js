'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const password = await require('bcrypt').hash('password', 10);

    await queryInterface.bulkInsert('User', [
      {
        username: 'admin',
        email: 'admin@mail.com',
        password,
        role: 'admin',
        isVerified: true,
        displayName: 'Admin',
        verificationToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user',
        email: 'user@mail.com',
        password,
        role: 'member',
        isVerified: true,
        displayName: 'User',
        verificationToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'other',
        email: 'other@mail.com',
        password,
        role: 'member',
        isVerified: true,
        displayName: 'Other',
        verificationToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'friend',
        email: 'friend@mail.com',
        password,
        role: 'member',
        isVerified: true,
        displayName: 'Friend',
        verificationToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {});
    await queryInterface.sequelize.query('TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;');
  }
};

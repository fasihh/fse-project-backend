'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const password = await require('bcrypt').hash('password', 10);

    await queryInterface.bulkInsert('User', [
      {
        username: 'fasih',
        email: 'k230018@nu.edu.pk',
        password,
        role: 'admin',
        isVerified: true,
        displayName: 'Fasih',
        verificationToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'owais',
        email: 'k230047@nu.edu.pk',
        password,
        role: 'admin',
        isVerified: true,
        displayName: 'Owais',
        verificationToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'abdul_rahman',
        email: 'k230061@nu.edu.pk',
        password,
        role: 'admin',
        isVerified: true,
        displayName: 'Abdul Rahman',
        verificationToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'fahad',
        email: 'k230062@nu.edu.pk',
        password,
        role: 'admin',
        isVerified: true,
        displayName: 'S. Fahad',
        verificationToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'ali',
        email: 'k230052@nu.edu.pk',
        password,
        role: 'member',
        isVerified: true,
        displayName: 'M. Ali',
        verificationToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'abser',
        email: 'k230030@nu.edu.pk',
        password,
        role: 'member',
        isVerified: true,
        displayName: 'Abser',
        verificationToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {});
    await queryInterface.sequelize.query('TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;');
  }
};

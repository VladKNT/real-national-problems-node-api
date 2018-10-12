'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
          len: [2, 32],
        },
      },
      last_name: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
          len: [2, 32],
        },
      },
      profile_photo: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
          len: [2, 32],
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserProfiles');
  }
};
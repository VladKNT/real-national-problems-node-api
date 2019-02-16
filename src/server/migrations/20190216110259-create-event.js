'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(128),
        validate: {
          notEmpty: true,
          len: [4, 128],
        },
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(255),
        validate: {
          notEmpty: true,
          len: [4, 255]
        },
        allowNull: false
      },
      photo: {
        type: Sequelize.STRING(128),
        validate: {
          notEmpty: true,
        },
        allowNull: false
      },
      latitude: {
        type: Sequelize.DECIMAL,
        validate: {
          notEmpty: true
        },
        allowNull: false
      },
      longitude: {
        type: Sequelize.DECIMAL,
        validate: {
          notEmpty: true
        },
        allowNull: false
      },
      dateStart: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dateEnd: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      creatorId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'creatorId'
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Events');
  }
};
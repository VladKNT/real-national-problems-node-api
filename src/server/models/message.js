'use strict';
const message = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    message: {
      type: DataTypes.STRING(255),
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
      allowNull: false
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deletedForAll: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {});
  Message.associate = function(models) {
    Message.hasMany(models.UserMessage, {
      foreignKey: 'messageId',
      as: 'userMessageId',
    });

    Message.belongsTo(models.User, {
      foreignKey: 'creatorId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    Message.belongsTo(models.Chat, {
      foreignKey: 'chatId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    Message.belongsToMany(models.User, {
      foreignKey: 'messageId',
      as: 'readers',
      through: 'UserMessages',

      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Message;
};

export default message;

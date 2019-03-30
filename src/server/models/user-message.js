'use strict';
const userMessage = (sequelize, DataTypes) => {
  const UserMessage = sequelize.define('UserMessage', {
    // Place for addition fields
  }, {});
  UserMessage.associate = function(models) {
    UserMessage.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    UserMessage.belongsTo(models.Message, {
      foreignKey: 'messageId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  };
  return UserMessage;
};

export default userMessage;

'use strict';
const userChat = (sequelize, DataTypes) => {
  const UserChat = sequelize.define('UserChat', {
    // Place for addition fields
  }, {});
  UserChat.associate = function(models) {
    UserChat.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    UserChat.belongsTo(models.Chat, {
      foreignKey: 'chatId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  };
  return UserChat;
};

export default userChat;

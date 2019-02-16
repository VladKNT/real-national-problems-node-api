'use strict';
const userEvent = (sequelize, DataTypes) => {
  const UserEvent = sequelize.define('UserEvent', {
    // Place for addition fields
  }, {});
  UserEvent.associate = function(models) {
    UserEvent.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    UserEvent.belongsTo(models.Chat, {
      foreignKey: 'eventId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  };
  return UserEvent;
};

export default userEvent;

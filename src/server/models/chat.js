const chat = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    name: {
      type: DataTypes.STRING(16)
    },
    description: {
      type: DataTypes.STRING(128)
    },
    icon: {
      type: DataTypes.STRING
    },
    creatorId: {
      type: DataTypes.INTEGER
    },
    private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  Chat.associate = function(models) {
    Chat.hasMany(models.Message, {
      foreignKey: 'chatId',
      as: 'messages'
    });

    Chat.hasMany(models.UserChat, {
      foreignKey: 'chatId',
      as: 'userChatIds'
    });

    Chat.belongsTo(models.User, {
      foreignKey: 'creatorId',

      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    Chat.belongsToMany(models.User, {
      foreignKey: 'chatId',
      as: 'members',
      through: 'UserChats',

      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  };
  return Chat;
};

export default chat;
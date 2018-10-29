import bcrypt from 'bcrypt';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING(16),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 16]
      },
    },
    email: {
      type: DataTypes.STRING(32),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [8, 32],
      },
    },
    role: {
      type: DataTypes.STRING(16),
      defaultValue: 'USER'
    },
  }, {});

  User.associate = function(models) {
    User.hasOne(models.UserProfile, {
      foreignKey: 'userId',
      as: 'userProfile'
    });

    User.hasMany(models.RefreshToken, {
      foreignKey: 'userId',
      as: 'refreshTokens'
    });

    User.hasMany(models.Message, {
      foreignKey: 'creatorId',
      as: 'messages'
    });

    User.hasMany(models.UserChat, {
      foreignKey: 'userId',
      as: 'userChatIds',
    });

    User.hasMany(models.Message, {
      foreignKey: 'creatorId',
      as: 'ownChats'
    });

    User.belongsToMany(models.Chat, {
      foreignKey: 'userId',
      as: 'chats',
      through: 'UserChats',

      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  };

  User.findByLogin = async (login, models) => {
    let user = await User.findOne({
      where: { username: login },
      include: [{
        model: models.RefreshToken,
        as: 'refreshTokens'
      }]
    });

    if (!user) {
      user =  await User.findOne({
        where: { email: login }
      });
    }

    return user;
  };

  User.beforeCreate(async (user) => {
    user.password = await user.generatePasswordHash();
  });

  User.prototype.generatePasswordHash = async function() {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };

  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};

export default user;
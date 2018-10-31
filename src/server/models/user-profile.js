const userProfile = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define('UserProfile', {
    firstName: {
      type: DataTypes.STRING(32),
      validate: {
        notEmpty: true,
        len: [2, 32],
      },
    },
    lastName: {
      type: DataTypes.STRING(32),
      validate: {
        notEmpty: true,
        len: [2, 32],
      },
    },
    profilePhoto: {
      type: DataTypes.STRING
    },
  }, {});
  UserProfile.associate = function(models) {
    UserProfile.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  };
  return UserProfile;
};

export default userProfile;

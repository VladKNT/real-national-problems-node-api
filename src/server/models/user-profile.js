const userProfile = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define('UserProfile', {
    firstName: {
      type: DataTypes.STRING(32),
      allowNull: true,
      validate: {
        notEmpty: true,
        len: [2, 32],
      },
    },
    lastName: {
      type: DataTypes.STRING(32),
      allowNull: true,
      validate: {
        notEmpty: true,
        len: [2, 32],
      },
    },
    bio: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true
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

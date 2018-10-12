'use strict';
const userProfile = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define('UserProfile', {
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        len: [2, 32],
      },
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        len: [2, 32],
      },
    },
    profile_photo: {
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

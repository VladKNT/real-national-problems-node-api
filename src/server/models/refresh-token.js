const refreshToken = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    token: {
      type: DataTypes.STRING(512),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      },
    },
  }, {});

  RefreshToken.associate = function(models) {
    RefreshToken.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  };
  return RefreshToken;
};

export default refreshToken;

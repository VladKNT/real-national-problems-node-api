'use strict';
const userSubComment = (sequelize, DataTypes) => {
  const UserSubComment = sequelize.define('UserSubComment', {
    // Place for addition fields
  }, {});
  UserSubComment.associate = function(models) {
    UserSubComment.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    UserSubComment.belongsTo(models.SubComment, {
      foreignKey: 'subCommentId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  };
  return UserSubComment;
};

export default userSubComment;

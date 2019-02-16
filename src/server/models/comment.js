'use strict';
const comment = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    comment: {
      type: DataTypes.STRING(255),
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
      allowNull: false
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  Comment.associate = function(models) {
    Comment.hasMany(models.SubComment, {
      foreignKey: 'commentId',
      as: 'subComments'
    });

    Comment.belongsTo(models.User, {
      foreignKey: 'creatorId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    Comment.belongsTo(models.Event, {
      foreignKey: 'eventId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Comment;
};

export default comment;

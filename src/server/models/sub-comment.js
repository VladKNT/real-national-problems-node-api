const subComment = (sequelize, DataTypes) => {
  const SubComment = sequelize.define('SubComment', {
    subComment: {
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
  SubComment.associate = function(models) {
    SubComment.belongsTo(models.User, {
      creatorId: 'creatorId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    SubComment.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    SubComment.belongsToMany(models.User, {
      foreignKey: 'subCommentId',
      as: 'respondents',
      through: 'UserSubComments',

      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return SubComment;
};

export default subComment;

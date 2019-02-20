'use strict';

const event = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    name: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
        len: [4, 128],
      },
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      validate: {
        notEmpty: true,
        len: [4, 255]
      },
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL,
      validate: {
        notEmpty: true
      },
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL,
      validate: {
        notEmpty: true
      },
      allowNull: false
    },
    dateStart: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dateEnd: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {});
  Event.associate = function(models) {
    Event.hasMany(models.Comment, {
      foreignKey: 'eventId',
      as: 'comments'
    });

    Event.hasMany(models.UserEvent, {
      foreignKey: 'eventId',
      as: 'userEventIds',
    });

    Event.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'creator',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    Event.belongsToMany(models.User, {
      foreignKey: 'eventId',
      as: 'participants',
      through: 'UserEvents',

      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Event;
};

export default event;

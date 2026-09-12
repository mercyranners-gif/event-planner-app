const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM(
        'booking_request',
        'booking_confirmed',
        'booking_cancelled',
        'event_reminder',
        'payment_reminder',
        'review_request',
        'message',
        'system',
        'other'
      ),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    relatedEntityType: {
      type: DataTypes.ENUM('event', 'booking', 'vendor', 'review'),
      allowNull: true
    },
    relatedEntityId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actionUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    channels: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: ['in-app'],
      comment: 'Array of channels: in-app, email, sms, push'
    },
    sentVia: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'notifications',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['isRead']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['type']
      }
    ]
  });

  return Notification;
};

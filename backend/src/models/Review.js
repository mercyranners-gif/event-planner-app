const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
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
    vendorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'vendors',
        key: 'id'
      }
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'bookings',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    aspects: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      comment: 'Object with ratings for different aspects: quality, communication, punctuality, etc.'
    },
    photos: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    isVerifiedBooking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    helpful: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    notHelpful: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    vendorResponse: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    vendorResponseDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    tableName: 'reviews',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['vendorId']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['rating']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  return Review;
};

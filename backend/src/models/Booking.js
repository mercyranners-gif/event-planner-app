const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'events',
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'confirmed',
        'cancelled',
        'completed',
        'disputed'
      ),
      defaultValue: 'pending'
    },
    serviceDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    serviceEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    quotedPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    finalPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD'
    },
    serviceDetails: {
      type: DataTypes.JSON,
      allowNull: true
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    depositRequired: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    depositPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    depositPaidDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paymentStatus: {
      type: DataTypes.ENUM(
        'pending',
        'partial',
        'paid',
        'refunded'
      ),
      defaultValue: 'pending'
    },
    totalPaid: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancellationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refundAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    contractDocument: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ratedAt: {
      type: DataTypes.DATE,
      allowNull: true
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
    tableName: 'bookings',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['eventId']
      },
      {
        fields: ['vendorId']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['serviceDate']
      }
    ]
  });

  return Booking;
};

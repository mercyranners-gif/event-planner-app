const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Vendor = sequelize.define('Vendor', {
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
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    businessType: {
      type: DataTypes.ENUM(
        'caterer',
        'florist',
        'photographer',
        'videographer',
        'decorator',
        'dj',
        'band',
        'venue',
        'planner',
        'other'
      ),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    socialMedia: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    basePrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD'
    },
    serviceRadius: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'In miles or kilometers'
    },
    yearsInBusiness: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    teamSize: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    portfolio: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    certifications: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    languages: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: ['English']
    },
    availability: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    responseTime: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'e.g., "within 24 hours"'
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
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
    tableName: 'vendors',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['businessType']
      },
      {
        fields: ['city']
      },
      {
        fields: ['rating']
      },
      {
        fields: ['isVerified']
      }
    ]
  });

  return Vendor;
};

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'event_planner_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

// Load models
const db = {};

// Import all models
const User = require('./User')(sequelize);
const Event = require('./Event')(sequelize);
const Vendor = require('./Vendor')(sequelize);
const Booking = require('./Booking')(sequelize);
const Budget = require('./Budget')(sequelize);
const Checklist = require('./Checklist')(sequelize);
const ChecklistItem = require('./ChecklistItem')(sequelize);
const Notification = require('./Notification')(sequelize);
const Review = require('./Review')(sequelize);

// Add models to db object
db.User = User;
db.Event = Event;
db.Vendor = Vendor;
db.Booking = Booking;
db.Budget = Budget;
db.Checklist = Checklist;
db.ChecklistItem = ChecklistItem;
db.Notification = Notification;
db.Review = Review;

// ==================== ASSOCIATIONS ====================

// User associations
db.User.hasMany(db.Event, {
  foreignKey: 'userId',
  as: 'events',
  onDelete: 'CASCADE'
});

db.User.hasMany(db.Vendor, {
  foreignKey: 'userId',
  as: 'vendor',
  onDelete: 'CASCADE'
});

db.User.hasMany(db.Booking, {
  foreignKey: 'userId',
  as: 'bookings',
  onDelete: 'CASCADE'
});

db.User.hasMany(db.Notification, {
  foreignKey: 'userId',
  as: 'notifications',
  onDelete: 'CASCADE'
});

db.User.hasMany(db.Review, {
  foreignKey: 'userId',
  as: 'reviews',
  onDelete: 'CASCADE'
});

// Event associations
db.Event.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'organizer'
});

db.Event.hasMany(db.Booking, {
  foreignKey: 'eventId',
  as: 'bookings',
  onDelete: 'CASCADE'
});

db.Event.hasOne(db.Budget, {
  foreignKey: 'eventId',
  as: 'budget',
  onDelete: 'CASCADE'
});

db.Event.hasMany(db.Checklist, {
  foreignKey: 'eventId',
  as: 'checklists',
  onDelete: 'CASCADE'
});

// Vendor associations
db.Vendor.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'owner'
});

db.Vendor.hasMany(db.Booking, {
  foreignKey: 'vendorId',
  as: 'bookings',
  onDelete: 'CASCADE'
});

db.Vendor.hasMany(db.Review, {
  foreignKey: 'vendorId',
  as: 'reviews',
  onDelete: 'CASCADE'
});

// Booking associations
db.Booking.belongsTo(db.Event, {
  foreignKey: 'eventId',
  as: 'event'
});

db.Booking.belongsTo(db.Vendor, {
  foreignKey: 'vendorId',
  as: 'vendor'
});

db.Booking.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'organizer'
});

// Budget associations
db.Budget.belongsTo(db.Event, {
  foreignKey: 'eventId',
  as: 'event'
});

// Checklist associations
db.Checklist.belongsTo(db.Event, {
  foreignKey: 'eventId',
  as: 'event'
});

db.Checklist.hasMany(db.ChecklistItem, {
  foreignKey: 'checklistId',
  as: 'items',
  onDelete: 'CASCADE'
});

// ChecklistItem associations
db.ChecklistItem.belongsTo(db.Checklist, {
  foreignKey: 'checklistId',
  as: 'checklist'
});

// Notification associations
db.Notification.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'user'
});

// Review associations
db.Review.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'reviewer'
});

db.Review.belongsTo(db.Vendor, {
  foreignKey: 'vendorId',
  as: 'vendor'
});

// ==================== HOOKS ====================

// Hash password before creating user
db.User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Hash password before updating user
db.User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Add instance method to User for password comparison
db.User.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

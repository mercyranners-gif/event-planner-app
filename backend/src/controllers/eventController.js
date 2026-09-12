const db = require('../models');
const { Op } = require('sequelize');

const Event = db.Event;
const User = db.User;
const Booking = db.Booking;

// @desc    Create new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    const { title, description, eventType, startDate, endDate, location, city, state, country, guestCount, budget } = req.body;

    if (!title || !eventType || !startDate || !endDate || !location || !city || !country) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const event = await Event.create({
      userId: req.user.id,
      title,
      description,
      eventType,
      startDate,
      endDate,
      location,
      city,
      state,
      country,
      guestCount,
      budget,
      status: 'planning'
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all events for user
// @route   GET /api/events
// @access  Private
exports.getUserEvents = async (req, res) => {
  try {
    const { status, eventType, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = { userId: req.user.id };

    if (status) {
      where.status = status;
    }

    if (eventType) {
      where.eventType = eventType;
    }

    const events = await Event.findAndCountAll({
      where,
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Booking, as: 'bookings' }
      ],
      offset,
      limit: parseInt(limit),
      order: [['startDate', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: events.count,
      page: parseInt(page),
      totalPages: Math.ceil(events.count / limit),
      events: events.rows
    });
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Booking, as: 'bookings', include: [{ model: User, as: 'organizer' }] }
      ]
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check authorization
    if (event.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this event' });
    }

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check authorization
    if (event.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }

    event = await event.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check authorization
    if (event.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    await event.destroy();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Search events
// @route   GET /api/events/search
// @access  Public
exports.searchEvents = async (req, res) => {
  try {
    const { keyword, city, eventType, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = { isPublished: true };

    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ];
    }

    if (city) {
      where.city = city;
    }

    if (eventType) {
      where.eventType = eventType;
    }

    const events = await Event.findAndCountAll({
      where,
      include: [{ model: User, as: 'organizer', attributes: ['id', 'firstName', 'lastName'] }],
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: events.count,
      page: parseInt(page),
      totalPages: Math.ceil(events.count / limit),
      events: events.rows
    });
  } catch (error) {
    console.error('Search events error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get event statistics
// @route   GET /api/events/:id/statistics
// @access  Private
exports.getEventStatistics = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: Booking, as: 'bookings' }]
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check authorization
    if (event.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const stats = {
      totalBookings: event.bookings.length,
      confirmedBookings: event.bookings.filter(b => b.status === 'confirmed').length,
      pendingBookings: event.bookings.filter(b => b.status === 'pending').length,
      cancelledBookings: event.bookings.filter(b => b.status === 'cancelled').length,
      totalSpent: event.totalSpent,
      budget: event.budget,
      remaining: event.budget - event.totalSpent
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get event statistics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

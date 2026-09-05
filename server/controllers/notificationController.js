const Notification = require("../models/Notification");

// @desc    Get notifications
// @route   GET /api/notifications
// @access  Public
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch notifications",
      error: error.message,
    });
  }
};

// @desc    Get user notifications
// @route   GET /api/notifications/user/:userId
// @access  Public
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch user notifications",
      error: error.message,
    });
  }
};

// @desc    Create new notification (POST)
// @route   POST /api/notifications
// @access  Public
const createNotification = async (req, res) => {
  try {
    const { user, message } = req.body;

    if (!user || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide user and message for the notification",
      });
    }

    const notification = await Notification.create({
      user,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating notification",
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  getUserNotifications,
  createNotification,
};

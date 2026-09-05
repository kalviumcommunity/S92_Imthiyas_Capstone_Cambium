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

module.exports = {
  getNotifications,
  getUserNotifications,
};

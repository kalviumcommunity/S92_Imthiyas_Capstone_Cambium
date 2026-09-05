const Bookmark = require("../models/Bookmark");
const User = require("../models/User");

// @desc    Get all bookmarks
// @route   GET /api/bookmarks
// @access  Public
const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find()
      .populate("user", "fullName email")
      .populate("opportunity");

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch bookmarks",
      error: error.message,
    });
  }
};

// @desc    Get bookmarks for specific user
// @route   GET /api/bookmarks/user/:userId
// @access  Public
const getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.params.userId }).populate(
      "opportunity"
    );

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch user bookmarks",
      error: error.message,
    });
  }
};

// @desc    Create bookmark
// @route   POST /api/bookmarks
// @access  Public
const createBookmark = async (req, res) => {
  try {
    const { user, opportunity } = req.body;

    const existingBookmark = await Bookmark.findOne({ user, opportunity });
    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: "Opportunity already bookmarked by this user",
      });
    }

    const bookmark = await Bookmark.create({ user, opportunity });

    await User.findByIdAndUpdate(user, {
      $addToSet: { bookmarks: bookmark._id },
    });

    res.status(201).json({
      success: true,
      message: "Opportunity bookmarked successfully",
      data: bookmark,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating bookmark",
      error: error.message,
    });
  }
};

// @desc    Delete bookmark
// @route   DELETE /api/bookmarks/:id
// @access  Public
const deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findByIdAndDelete(req.params.id);

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found",
      });
    }

    await User.findByIdAndUpdate(bookmark.user, {
      $pull: { bookmarks: bookmark._id },
    });

    res.status(200).json({
      success: true,
      message: "Bookmark removed successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting bookmark",
      error: error.message,
    });
  }
};

module.exports = {
  getBookmarks,
  getUserBookmarks,
  createBookmark,
  deleteBookmark,
};

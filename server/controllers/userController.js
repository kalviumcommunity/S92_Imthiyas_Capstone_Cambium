const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("bookmarks");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch users",
      error: error.message,
    });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("bookmarks");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};

// @desc    Create new user profile (POST)
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
  try {
    const { fullName, email, institution, researchInterests } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide fullName and email",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const user = await User.create({
      fullName,
      email,
      institution,
      researchInterests: researchInterests || [],
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation Error: Unable to create user",
      error: error.message,
    });
  }
};

// @desc    Add research interests to user profile (POST)
// @route   POST /api/users/:id/interests
// @access  Public
const addUserInterests = async (req, res) => {
  try {
    const { interests } = req.body;
    const interestsArray = Array.isArray(interests) ? interests : [interests];

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { researchInterests: { $each: interestsArray } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Research interests updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error adding research interests",
      error: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Public
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating user profile",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  addUserInterests,
  updateUser,
};

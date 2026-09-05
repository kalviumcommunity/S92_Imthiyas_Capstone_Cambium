const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user (Username & Password Signup + JWT generation)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, fullName, email, password, institution, researchInterests } =
      req.body;

    if (!username || !fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, fullName, email, and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists by username or email
    const existingUser = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.username === username.toLowerCase()
            ? "Username is already taken"
            : "User with this email already exists",
      });
    }

    // Create user (password automatically hashed by pre-save hook)
    const user = await User.create({
      username,
      fullName,
      email,
      password,
      institution,
      researchInterests: researchInterests || [],
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      token,
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        institution: user.institution,
        researchInterests: user.researchInterests,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error during registration",
      error: error.message,
    });
  }
};

// @desc    Authenticate user & login (Username & Password Login + JWT generation)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const identifier = username || email;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username/email and password",
      });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: identifier.toLowerCase() },
        { email: identifier.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials: User not found",
      });
    }

    // Verify password using bcrypt match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials: Password incorrect",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        institution: user.institution,
        researchInterests: user.researchInterests,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error during login",
      error: error.message,
    });
  }
};

// @desc    Get currently authenticated user details via JWT Authorization
// @route   GET /api/auth/me
// @access  Private (Protected by JWT)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User authorization verified via Bearer JWT",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching authorized user",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};

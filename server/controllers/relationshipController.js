const User = require("../models/User");
const ResearchOpportunity = require("../models/ResearchOpportunity");
const Bookmark = require("../models/Bookmark");
const Notification = require("../models/Notification");

// @desc    Get user profile with fully populated entity relationships (Bookmarks & Opportunities)
// @route   GET /api/relationships/user/:userId
// @access  Public
const getUserRelationships = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate({
        path: "bookmarks",
        populate: {
          path: "opportunity",
          model: "ResearchOpportunity",
        },
      })
      .populate("createdOpportunities");

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
      message: "Error fetching user relationships",
      error: error.message,
    });
  }
};

// @desc    Get opportunity with creator details and all bookmarked users
// @route   GET /api/relationships/opportunity/:opportunityId
// @access  Public
const getOpportunityRelationships = async (req, res) => {
  try {
    const opportunity = await ResearchOpportunity.findById(
      req.params.opportunityId
    ).populate("createdBy", "fullName email institution");

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Research opportunity not found",
      });
    }

    const bookmarks = await Bookmark.find({
      opportunity: req.params.opportunityId,
    }).populate("user", "fullName email institution");

    res.status(200).json({
      success: true,
      data: {
        opportunity,
        bookmarkedByCount: bookmarks.length,
        bookmarkedByUsers: bookmarks.map((b) => b.user),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching opportunity relationships",
      error: error.message,
    });
  }
};

// @desc    Get overview of all database entity relationships
// @route   GET /api/relationships/overview
// @access  Public
const getRelationshipOverview = async (req, res) => {
  try {
    const users = await User.find()
      .limit(5)
      .populate({
        path: "bookmarks",
        populate: { path: "opportunity" },
      });

    const bookmarks = await Bookmark.find()
      .limit(5)
      .populate("user", "fullName email")
      .populate("opportunity");

    const notifications = await Notification.find()
      .limit(5)
      .populate("user", "fullName email")
      .populate("opportunity");

    res.status(200).json({
      success: true,
      summary: {
        entityTypes: ["User", "ResearchOpportunity", "Bookmark", "Notification"],
        relationships: [
          "User 1:N Bookmark (User.bookmarks -> ref: Bookmark)",
          "User 1:N ResearchOpportunity (User.createdOpportunities -> ref: ResearchOpportunity)",
          "Bookmark N:1 User & N:1 Opportunity (Junction table)",
          "Notification N:1 User & N:1 Opportunity",
        ],
      },
      data: {
        users,
        bookmarks,
        notifications,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating relationship overview",
      error: error.message,
    });
  }
};

module.exports = {
  getUserRelationships,
  getOpportunityRelationships,
  getRelationshipOverview,
};

const ResearchOpportunity = require("../models/ResearchOpportunity");

// @desc    Get all research opportunities
// @route   GET /api/research-opportunities
// @access  Public
const getOpportunities = async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = {};

    if (type) {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const opportunities = await ResearchOpportunity.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch opportunities",
      error: error.message,
    });
  }
};

// @desc    Get single research opportunity by ID
// @route   GET /api/research-opportunities/:id
// @access  Public
const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await ResearchOpportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Research opportunity not found",
      });
    }

    res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Invalid ID or fetch error",
      error: error.message,
    });
  }
};

// @desc    Create new research opportunity
// @route   POST /api/research-opportunities
// @access  Public
const createOpportunity = async (req, res) => {
  try {
    const { title, type, organization, deadline, description, link, tags } =
      req.body;

    if (!title || !type || !organization) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, type, and organization",
      });
    }

    const opportunity = await ResearchOpportunity.create({
      title,
      type,
      organization,
      deadline,
      description,
      link,
      tags,
    });

    res.status(201).json({
      success: true,
      message: "Research opportunity created successfully",
      data: opportunity,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation Error: Unable to create opportunity",
      error: error.message,
    });
  }
};

// @desc    Update research opportunity
// @route   PUT /api/research-opportunities/:id
// @access  Public
const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await ResearchOpportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Research opportunity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Research opportunity updated successfully",
      data: opportunity,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating opportunity",
      error: error.message,
    });
  }
};

// @desc    Delete research opportunity
// @route   DELETE /api/research-opportunities/:id
// @access  Public
const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await ResearchOpportunity.findByIdAndDelete(
      req.params.id
    );

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Research opportunity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Research opportunity deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting opportunity",
      error: error.message,
    });
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};

const express = require("express");
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  getOpportunityStats,
  getUpcomingDeadlines,
  createOpportunity,
  createMultipleOpportunities,
  getRecommendedOpportunities,
  updateOpportunity,
  updateOpportunityTags,
  deleteOpportunity,
} = require("../controllers/opportunityController");

// GET & POST /api/research-opportunities
router.route("/").get(getOpportunities).post(createOpportunity);

// POST /api/research-opportunities/bulk
router.route("/bulk").post(createMultipleOpportunities);

// POST /api/research-opportunities/recommendations
router.route("/recommendations").post(getRecommendedOpportunities);

// GET /api/research-opportunities/stats
router.route("/stats").get(getOpportunityStats);

// GET /api/research-opportunities/upcoming-deadlines
router.route("/upcoming-deadlines").get(getUpcomingDeadlines);

// PUT /api/research-opportunities/:id/tags
router.route("/:id/tags").put(updateOpportunityTags);

// GET, PUT, DELETE /api/research-opportunities/:id
router
  .route("/:id")
  .get(getOpportunityById)
  .put(updateOpportunity)
  .delete(deleteOpportunity);

module.exports = router;

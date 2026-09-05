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
  deleteOpportunity,
} = require("../controllers/opportunityController");

// GET /api/research-opportunities & POST /api/research-opportunities
router.route("/").get(getOpportunities).post(createOpportunity);

// POST /api/research-opportunities/bulk (Bulk creation)
router.route("/bulk").post(createMultipleOpportunities);

// POST /api/research-opportunities/recommendations (AI Recommendations)
router.route("/recommendations").post(getRecommendedOpportunities);

// GET /api/research-opportunities/stats
router.route("/stats").get(getOpportunityStats);

// GET /api/research-opportunities/upcoming-deadlines
router.route("/upcoming-deadlines").get(getUpcomingDeadlines);

// GET, PUT, DELETE /api/research-opportunities/:id
router
  .route("/:id")
  .get(getOpportunityById)
  .put(updateOpportunity)
  .delete(deleteOpportunity);

module.exports = router;

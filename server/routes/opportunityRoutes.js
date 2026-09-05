const express = require("express");
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  getOpportunityStats,
  getUpcomingDeadlines,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require("../controllers/opportunityController");

// GET /api/research-opportunities & POST /api/research-opportunities
router.route("/").get(getOpportunities).post(createOpportunity);

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

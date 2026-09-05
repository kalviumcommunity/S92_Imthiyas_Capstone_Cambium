const express = require("express");
const router = express.Router();
const {
  getUserRelationships,
  getOpportunityRelationships,
  getRelationshipOverview,
} = require("../controllers/relationshipController");

router.route("/overview").get(getRelationshipOverview);
router.route("/user/:userId").get(getUserRelationships);
router.route("/opportunity/:opportunityId").get(getOpportunityRelationships);

module.exports = router;

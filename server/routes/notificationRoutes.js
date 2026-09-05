const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getUserNotifications,
} = require("../controllers/notificationController");

router.route("/").get(getNotifications);
router.route("/user/:userId").get(getUserNotifications);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getUserNotifications,
  createNotification,
} = require("../controllers/notificationController");

router.route("/").get(getNotifications).post(createNotification);
router.route("/user/:userId").get(getUserNotifications);

module.exports = router;

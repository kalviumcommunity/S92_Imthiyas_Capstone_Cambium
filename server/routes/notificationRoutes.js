const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getUserNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController");

router.route("/").get(getNotifications).post(createNotification);
router.route("/user/:userId").get(getUserNotifications);
router.route("/:id/read").put(markNotificationAsRead);
router.route("/user/:userId/read-all").put(markAllNotificationsAsRead);

module.exports = router;

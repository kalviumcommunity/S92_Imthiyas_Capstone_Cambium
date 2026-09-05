const express = require("express");
const router = express.Router();
const {
  getBookmarks,
  getUserBookmarks,
  createBookmark,
  deleteBookmark,
} = require("../controllers/bookmarkController");

router.route("/").get(getBookmarks).post(createBookmark);
router.route("/user/:userId").get(getUserBookmarks);
router.route("/:id").delete(deleteBookmark);

module.exports = router;

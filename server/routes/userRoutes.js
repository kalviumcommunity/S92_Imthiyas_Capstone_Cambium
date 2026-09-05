const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  addUserInterests,
  updateUser,
} = require("../controllers/userController");

router.route("/").get(getUsers).post(createUser);
router.route("/:id/interests").post(addUserInterests);
router.route("/:id").get(getUserById).put(updateUser);

module.exports = router;

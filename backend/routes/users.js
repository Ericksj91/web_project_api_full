const router = require("express").Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");
const {
  validateUpdateUser,
  validateUpdateAvatar,
  validateUserId,
} = require("../middlewares/validators");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get("/:userId", validateUserId, getUserById);
router.patch("/me", validateUpdateUser, updateUser);
router.patch("/me/avatar", validateUpdateAvatar, updateAvatar);

module.exports = router;

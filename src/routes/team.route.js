const express = require("express");
const router = express.Router();

const {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/team.controller");
const isAuthenticated = require("../middlewares/authentication");
const upload = require("../utils/multer");

// 🟢 PUBLIC ROUTES (Visitors can view team without login)
router.get("/", getAllTeamMembers);
router.get("/:id", getTeamMemberById);

// 🔒 ADMIN ROUTES (Protected with Authentication)
router.post("/", isAuthenticated, upload.single("image"), createTeamMember);
router.patch("/:id", isAuthenticated, upload.single("image"), updateTeamMember);
router.delete("/:id", isAuthenticated, deleteTeamMember);

module.exports = router;

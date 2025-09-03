const express = require("express");
const router = express.Router();

const {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/team.controller");

const upload = require("../utils/multer"); 

// Create new team member (with image)
router.post("/", upload.single("image"), createTeamMember);

// Get all team members
router.get("/", getAllTeamMembers);

// Get single team member by ID
router.get("/:id", getTeamMemberById);

// Update team member (optional new image)
router.patch("/:id", upload.single("image"), updateTeamMember);

// Delete team member
router.delete("/:id", deleteTeamMember);

module.exports = router;

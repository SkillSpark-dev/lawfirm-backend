const express = require("express");
const router = express.Router();
const {
  getAbout, createAbout, updateAbout, deleteAbout  
} = require("../controllers/about.controller");
const isAuthenticated = require("../middlewares/authentication");
const upload  = require("../utils/multer"); // ✅ import multer

// ✅ Public route: anyone can access About info
router.get("/", getAbout);

// ✅ Admin routes: require authentication + Multer middleware
router.post(
  "/",
  isAuthenticated,
  upload.single("image"), 
  createAbout
);

router.patch(
  "/:id",
  isAuthenticated,
  upload.single("image"), 
  updateAbout
);

router.delete("/:id", isAuthenticated, deleteAbout);

module.exports = router;

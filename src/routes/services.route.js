const express = require("express");
const router = express.Router();

const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/services.conntroller");
const isAuthenticated = require("../middlewares/authentication");
const upload  = require("../utils/multer");

// 🟢 PUBLIC ROUTES (Visitors can view services)
router.get("/", getAllServices);
router.get("/:id", getServiceById);

// 🔒 ADMIN ROUTES (Protected with Authentication)
router.post("/", isAuthenticated, upload.single("image"), createService);
router.put("/:id", isAuthenticated, upload.single("image"), updateService);
router.delete("/:id", isAuthenticated, deleteService);

module.exports = router;

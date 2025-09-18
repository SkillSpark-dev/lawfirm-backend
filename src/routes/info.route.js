const express  = require("express");
const router = express.Router();
const {
    createInfo,
    getInfo,
    updateInfo,
    deleteInfo
} = require("../controllers/info.controller");
const isAuthenticated  = require("../middlewares/authentication");
const upload  = require("../utils/multer");

router.post("/", isAuthenticated, upload.single("image"), createInfo);
router.get("/", getInfo);
router.patch("/:id", isAuthenticated, upload.single("image"), updateInfo);
router.delete("/:id", isAuthenticated, deleteInfo);

module.exports = router;

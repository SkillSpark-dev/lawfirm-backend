const express = require("express");
const router = express.Router();

const {
        getNavbar,
        updateNavbar
} = require("../controllers/navbar.controller");

// Create gert navbar
router.get("/", getNavbar);

// Update or create navbar
router.post("/", updateNavbar);
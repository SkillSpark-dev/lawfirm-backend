const express = require("express");
const router = express.Router();

const { createContact, getAllContacts,getContactById, deleteContact } = require("../controllers/contact.controller");
 const isAuthenticated = require("../middlewares/authentication");
// POST - Submit contact form
router.post("/",isAuthenticated, createContact);

// GET - Get all contacts (for admin, optionally secure this route)
router.get("/",isAuthenticated, getAllContacts);

router.get('/:id',isAuthenticated,getContactById);

// DELETE - Delete contact by ID (for admin, optionally secure this route)
router.delete("/:id",isAuthenticated, deleteContact);

module.exports = router;

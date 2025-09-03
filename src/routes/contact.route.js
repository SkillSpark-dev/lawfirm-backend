const express = require("express");
const router = express.Router();

const { createContact, getAllContacts,getContactById, deleteContact } = require("../controllers/contact.controller");

// POST - Submit contact form
router.post("/", createContact);

// GET - Get all contacts (for admin, optionally secure this route)
router.get("/", getAllContacts);

router.get('/:id',getContactById);

// DELETE - Delete contact by ID (for admin, optionally secure this route)
router.delete("/:id", deleteContact);

module.exports = router;

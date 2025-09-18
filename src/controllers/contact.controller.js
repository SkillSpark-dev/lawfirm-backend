
const Contact = require("../models/contact.model");
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  message: Joi.string().required(),
  number: Joi.string().allow("").optional() // ✅ Must allow empty
});



exports.createContact = async (req, res) => {
  try {
    const { name, email, message, number } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const contact = await Contact.create({ name, email, message, number });

    res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create contact",
      error: error.message,
    });
  }
};

// @desc    Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
};

// @desc    Get single contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact",
      error: error.message,
    });
  }
};

// @desc    Delete a contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
      error: error.message,
    });
  }
};

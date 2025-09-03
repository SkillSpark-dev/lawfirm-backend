const Joi = require('joi')
const Contact = require("../models/contact.model");
const dotenv = require("dotenv");

dotenv.config({ quiet: true });
const contactSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().required(),
  subject: Joi.string().trim().optional(),
  message: Joi.string().trim().required()
})
// Create contact message
const createContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    await newContact.save();
    res.status(201).json({ message: "Contact message received successfully", data: newContact });
  } catch (error) {
    next(error);
  }
};

// Get all contact messages (optional, admin use)
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ data: contacts });
  } catch (error) {
    next(error);
  }
};

//get contact by id
const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact is not found" });
    }
    res.status(200).json({ data: contact });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact= await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "contact is not found" });
    }

    await contact.deleteOne();
    res.status(200).json({ message: "Contact is deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact
};

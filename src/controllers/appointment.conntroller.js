const Appointment = require("../models/appointment.model");
const Joi = require("joi");

// Validation schema
const appointmentSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().required(),
  date: Joi.string().trim().required(),
  time: Joi.string().trim().required(),
});

// CREATE
const createAppointment = async (req, res, next) => {
  try {
    const { error, value } = appointmentSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "Validation failed", details: error.details });
    }

    const newAppointment = new Appointment(value);
    await newAppointment.save();

    res
      .status(201)
      .json({ message: "Appointment created successfully", data: newAppointment });
  } catch (err) {
    next(err);
  }
};

// READ ALL
const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json({ data: appointments });
  } catch (err) {
    next(err);
  }
};

// READ ONE
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ data: appointment });
  } catch (err) {
    next(err);
  }
};

// UPDATE
const updateAppointment = async (req, res, next) => {
  try {
    const { error, value } = appointmentSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "Validation failed", details: error.details });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res
      .status(200)
      .json({ message: "Appointment updated successfully", data: appointment });
  } catch (err) {
    next(err);
  }
};

// DELETE
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const deleteAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  deleteAppointmentById
};

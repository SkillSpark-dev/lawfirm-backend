const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  deleteAppointment,
  updateAppointment,
} = require("../controllers/appointment.conntroller");

// Create new appointment
router.post("/", createAppointment);

// Get all appointments
router.get("/", getAllAppointments);

// Get single appointment by ID
router.get("/:id", getAppointmentById);

// Update appointment
router.put("/:id", updateAppointment);

// Delete appointment by id
router.delete("/", deleteAppointment);
 //Delete appointment by user id
 router.delete("/:id", deleteAppointment);


module.exports = router;
 
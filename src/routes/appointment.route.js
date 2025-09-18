const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  deleteAppointment,
  updateAppointment,
} = require("../controllers/appointment.controller");

const isAuthenticated = require("../middlewares/authentication");

// 🟢 PUBLIC ROUTE (Visitors can create appointments)
router.post("/", createAppointment);

// 🔒 ADMIN ROUTES (Protected)
router.get("/", isAuthenticated, getAllAppointments);
router.get("/:id", isAuthenticated, getAppointmentById);
router.put("/:id", isAuthenticated, updateAppointment);
router.delete("/:id", isAuthenticated, deleteAppointment);

module.exports = router;

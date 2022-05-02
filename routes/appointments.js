const express = require('express')
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointments')

const Appointment = require('../models/Appointment')

const router = express.Router()

const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

router
  .route('/')
  .get(advancedResults(Appointment), getAppointments)
  .post(protect, createAppointment)
router
  .route('/:id')
  .get(advancedResults(Appointment), getAppointment)
  .put(protect, authorize('staff', 'admin'), updateAppointment)
  .delete(protect, authorize('staff', 'admin'), deleteAppointment)

module.exports = router

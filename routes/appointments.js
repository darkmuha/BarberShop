const express = require('express')
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointments')

const Appointment = require('../models/Appointment')

const advancedResults = require('../middleware/advancedResults')

const router = express.Router()

router
  .route('/')
  .get(advancedResults(Appointment), getAppointments)
  .post(createAppointment)
router
  .route('/:id')
  .get(getAppointment)
  .put(updateAppointment)
  .delete(deleteAppointment)

module.exports = router

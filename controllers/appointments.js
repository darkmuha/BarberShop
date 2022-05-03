const Appointment = require('../models/Appointment')
const asyncHandler = require('express-async-handler')
const ErrorResponse = require('../utils/errorResponse')

// @desc      Get all apointments
// @route     GET /api/v1/appointments
// @access    Public
exports.getAppointments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc      Get single apointment
// @route     GET /api/v1/appointments/:id
// @access    Public
exports.getAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)
  if (!appointment) {
    return next(
      new ErrorResponse(
        `Appointment not found with id of ${req.params.id}`,
        404
      )
    )
  }
  res.status(200).json({
    success: true,
    data: appointment,
  })
})

// @desc      Create new apointment
// @route     POST /api/v1/appointments/
// @access    Private
exports.createAppointment = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id

  // Check for published appointments
  const madeAppointment = await Appointment.findOne({
    staff: req.user.staff,
    startTime: req.user.startTime,
  })

  // if there is an appointment with the staff requested then return an error

  if (madeAppointment) {
    return next(
      new ErrorResponse(
        `The staff with ID ${req.user.id} has an appointment at that time`,
        400
      )
    )
  }

  const appointment = await Appointment.create(req.body)

  timeInHoursAndMinutes = [
    floor(
      appointment.startTime.split(':')[0] * 60 +
        appointment.startTime.split(':')[1] +
        appointment.duration / 60
    ),
    appointment.startTime.split(':')[0] * 60 +
      appointment.startTime.split(':')[1] +
      (appointment.duration % 60),
  ]
  req.user.endTime =
    (timeInHoursAndMinutes[0] < 10
      ? '0' + timeInHoursAndMinutes[0].toString()
      : timeInHoursAndMinutes[0].toString()) +
    ':' +
    (timeInHoursAndMinutes[1] < 10
      ? '0' + timeInHoursAndMinutes[1].toString()
      : timeInHoursAndMinutes[1].toString())

  res.status(201).json({
    success: true,
    date: appointment,
  })
})
// @desc      Update apointment
// @route     PUT /api/v1/appointments/:id
// @access    Private
exports.updateAppointment = asyncHandler(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id)

  // Make sure that the user is the owner of the appointment
  if (
    appointment.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this appointment`,
        401
      )
    )
  }

  appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!appointment) {
    return next(
      new ErrorResponse(
        `Appointment not found with id of ${req.params.id}`,
        404
      )
    )
  }
  res.status(201).json({
    success: true,
    date: appointment,
  })
})

// @desc      Delete apointment
// @route     GET /api/v1/appointments/:id
// @access    Private
exports.deleteAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)

  if (!appointment) {
    return next(
      new ErrorResponse(
        `Appointment not found with id of ${req.params.id}`,
        404
      )
    )
  }
  // Make sure that the user is the owner of the appointment
  if (
    appointment.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this appointment`,
        401
      )
    )
  }

  appointment.remove()

  res.status(201).json({
    success: true,
    date: {},
  })
})

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
  const appointment = await Appointment.create(req.body)

  res.status(201).json({
    success: true,
    date: appointment,
  })
})
// @desc      Update apointment
// @route     PUT /api/v1/appointments/:id
// @access    Private
exports.updateAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )

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
  await goal.remove()

  res.status(201).json({
    success: true,
    date: {},
  })
})

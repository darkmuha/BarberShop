const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const ErrorResponse = require('../utils/errorResponse')

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  })

  // Create Token
  const token = user.getSignedJwtToken()

  res.status(200).json({
    success: true,
    token,
  })
})

// @desc      Register user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Validate email and password
  if (!email || !password) {
    return next(
      new ErrorResponse('Please provide both email and password', 400)
    )
  }
  // Check if user exists and store it
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  // Checking if the passwords match
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  // Create Token
  const token = user.getSignedJwtToken()

  res.status(200).json({
    success: true,
    token,
  })
})

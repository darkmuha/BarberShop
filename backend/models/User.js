const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { JsonWebTokenError } = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phonenumber: {
      type: String,
      required: [true, 'Please add a phone number'],
      unique: true,
      match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Please add a valid phone number'],
    },
    role: {
      type: String,
      enum: ['customer', 'staff'],
      default: 'customer',
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
)

// Encrypting the password (using bcryptjs)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  // the higher the salt the more secure but the heavier it is (10 is the recommended)
  const salt = await bcrypt.genSalt(10)

  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
// check the github page for more info (reminder if future me forgets)
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// Match user entered password to hashed password in the database using bcrypt compare
UserSchema.methods.matchPassword = async function (passwordEntered) {
  return await bcrypt.compare(passwordEntered, this.password)
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token using crypto, and chaning it to a hex string
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash token and set to resetPasswordToken field in the model
  // all this is from the node crypto documentation
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  // Set resetPasswordExpire to 10 min. from now
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}

module.exports = mongoose.model('User', UserSchema)

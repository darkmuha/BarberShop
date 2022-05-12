const mongoose = require('mongoose')
const User = require('./User')

const AppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please enter user'],
    },
    staff: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please enter staff'],
    },
    options: {
      type: Array,
      option: {
        type: String,
        enum: ['Haircut', 'Beard', 'Face wash', 'Hair dye'],
        default: 'Haircut',
      },
      price: {
        type: Number,
        enum: [10, 15, 5, 50],
        defualt: 10,
      },
      duration: {
        type: Number,
        // 10 for a Haircut, Beard, and Face wash. 30 for Hair dye
        enum: [10, 30],
        default: 10,
      },
    },
    date: {
      type: Date,
      required: [true, 'Please enter a date'],
    },
    startTime: {
      type: String,
      required: [true, 'Please enter a start time'],
      match: [/\d{2}:\d{2}/, 'Please add a valid start time'],
    },
    fullDuration: Number,
    endTime: {
      type: String,
      match: [/\d{2}:\d{2}/, 'Please add a valid end time'],
    },
    payment: Number,
  },
  {
    timestamps: true,
  }
)

AppointmentSchema.statics.getPayment = async function (theID) {
  console.log('Calculating payment...'.blue)

  const addingFields = await this.aggregate([
    {
      $match: { _id: theID },
    },
    { $unwind: { path: '$options', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: theID,
        payment: { $sum: '$options.price' },
        fullDuration: { $sum: '$options.duration' },
      },
    },
  ])
  try {
    await this.findByIdAndUpdate(theID, {
      payment: addingFields[0].payment,
      fullDuration: addingFields[0].fullDuration,
    })
  } catch (err) {
    console.log(err)
  }
}

AppointmentSchema.post('save', function () {
  this.constructor.getPayment(this._id)
})

module.exports = mongoose.model('Appointment', AppointmentSchema)

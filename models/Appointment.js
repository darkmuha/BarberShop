const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: 'User',
      required: [true, 'Please enter user'],
    },
    staff: {
      type: String,
      ref: 'Staff',
      required: [true, 'Please enter staff'],
    },
    options: {
      type: Array,
      option: {
        type: String,
        enum: ['Option 1', 'Option 2', 'Option 3'],
        default: 'Option 1',
      },
      price: {
        type: Number,
        enum: [10, 20, 30],
        defualt: 10,
      },
      duration: {
        type: Number,
        enum: [15],
        default: 15,
      },
    },
    date: {
      type: Date,
      required: [true, 'Please enter a date'],
    },
    startTime: {
      type: String,
      required: [true, 'Please enter a start time'],
    },
    fullDuration: Number,
    endTime: {
      type: String,
      default: [true, 'Please enter an end time'],
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

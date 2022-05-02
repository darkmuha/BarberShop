const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const morgan = require('morgan')
const errorHandler = require('./middleware/error')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const hpp = require('hpp')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')

//Connect to database
connectDB()

// Routes
const appointments = require('./routes/appointments')
const auth = require('./routes/auth')
const users = require('./routes/users')

const app = express()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Sanitize data
// it helps against nosql injection
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevents XSS attacks
app.use(xss())

// Prevents http param pollution
app.use(hpp())

// Enable CORS
// communicate with api if we are not using postman
app.use(cors())

// Rate limiting (how many requests per a specific amount of time)
const limiter = rateLimit({
  windowMws: 10 * 60 * 1000, // 10 minutes
  max: 100,
})
app.use(limiter)

// Mount routers
app.use('/api/v1/appointments', appointments)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)

// //Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   console.log(`Error: ${err.message}`)
//   //Close server and exit process
//   server.close(() => process.exit(1))
// })

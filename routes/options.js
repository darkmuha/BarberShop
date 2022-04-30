const express = require('express')
const { getOptions } = require('../controllers/Options')
const router = express.Router()

router.route('/').get(getOptions)

module.exports = router

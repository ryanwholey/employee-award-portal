const express = require('express')
const router = express.Router()

const systemRoutes = require('./system')

router.use('/api', systemRoutes)

module.exports = router

const express = require('express')
const router = express.Router()

const authRoutes = require('./auth')
const awardTypeRoutes = require('./awardTypes')
const regionRoutes = require('./regions')
const systemRoutes = require('./system')
const userRoutes = require('./users')
const viewRoutes = require('./views')

const apiRoutes = [
    authRoutes,
    awardTypeRoutes,
    regionRoutes,
    systemRoutes,
    userRoutes,
]

apiRoutes.forEach(route => router.use('/api', route))

router.use(viewRoutes)

module.exports = router

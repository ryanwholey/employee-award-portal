const express = require('express')
const router = express.Router()

const authRoutes = require('./auth')
const awardRoutes = require('./awards')
const awardTypeRoutes = require('./awardTypes')
const regionRoutes = require('./regions')
const systemRoutes = require('./system')
const userRoutes = require('./users')
const viewRoutes = require('./views')

const apiRoutes = [
    authRoutes,
    awardRoutes,
    awardTypeRoutes,
    regionRoutes,
    systemRoutes,
    userRoutes,
]

apiRoutes.forEach(route => router.use('/api', route))

router.use(viewRoutes)

module.exports = router

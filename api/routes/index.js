const express = require('express')
const router = express.Router()

const authRoutes = require('./auth')
const awardTypeRoutes = require('./awardTypes')
const regionRoutes = require('./regions')
const systemRoutes = require('./system')
const userRoutes = require('./users')

const routes = [
    authRoutes,
    awardTypeRoutes,
    regionRoutes,
    systemRoutes,
    userRoutes,
]

routes.forEach(route => router.use('/api', route))

module.exports = router

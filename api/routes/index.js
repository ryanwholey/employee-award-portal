const express = require('express')
const router = express.Router()

const authRoutes = require('./auth')
const regionRoutes = require('./regions')
const systemRoutes = require('./system')
const userRoutes = require('./users')

const routes = [
    authRoutes,
    regionRoutes,
    systemRoutes,
    userRoutes,
]

routes.forEach(route => router.use('/api', route))

module.exports = router

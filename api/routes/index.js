const express = require('express')
const router = express.Router()

const systemRoutes = require('./system')
const userRoutes = require('./users')
const authRoutes = require('./auth')

const routes = [
    systemRoutes,
    userRoutes,
    authRoutes,
]

routes.forEach(route => router.use('/api', route))

module.exports = router

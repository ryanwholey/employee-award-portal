const express = require('express')
const router = express.Router()

const systemRoutes = require('./system')
const userRoutes = require('./users')

const routes = [
    systemRoutes,
    userRoutes,
]

routes.forEach(route => router.use('/api', route))


module.exports = router

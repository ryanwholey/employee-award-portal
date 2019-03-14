const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')

const config = require('./config')
const knex = require('../db/knex')
const routes = require('./routes')
const authMiddleware = require('./middleware/auth')
const scheduler = require('../bin/startEmailWorker');

const app = express()

const mediaSignaturesDir = path.resolve(__dirname, '../media/signatures')
if (!fs.existsSync(mediaSignaturesDir)) {
    fs.mkdirSync(mediaSignaturesDir)
}
const mediaAwardsDir = path.resolve(__dirname, '../media/awards')
if (!fs.existsSync(mediaAwardsDir)){
    fs.mkdirSync(mediaAwardsDir)
}

app.use(morgan(config.LOGGER_SETTINGS))
app.use(bodyParser.json({
    limit: '50mb',
}))
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
}))

app.use(authMiddleware.convertTokenToUser)

if (config.NODE_ENV === 'development') {
    // disable caching in development
    app.set('etag', false)
}

app.use('/media/signatures', express.static(path.resolve(__dirname, '../media/signatures')))

app.use(routes)

function initServer() {
    const server = app.listen(config.API_PORT, (err) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }

        console.log(`${config.NODE_ENV} api started at ${config.API_PORT}`)
    })

    server.kill = async function kill() {
        console.log('Shutting server down...')
        await knex.destroy()
        await server.close()
    }

    server.setTimeout(config.REQUEST_TIMEOUT)

    return server
}

let server
if (require.main === module) {
    server = initServer()
}

process.on('SIGINT', () => {
    console.log() // newline
    server.kill()
})

process.on('unhandledRejection', (error) => {
    console.error('unhandledRejection', error.message)
    console.error(error.stack)
    server.kill()
});

scheduler.scheduleAwards();

module.exports = {
    initServer,
}

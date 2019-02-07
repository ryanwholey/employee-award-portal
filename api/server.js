const _ = require('lodash')
const bodyParser = require('body-parser')
const express = require('express')
const { OK } = require('http-status-codes')
const morgan = require('morgan')

const config = require('./config')
const knex = require('../db/knex')
const routes = require('./routes')
const routingMiddleware = require('./middleware/routing')


const app = express()

app.use(morgan(config.LOGGER_SETTINGS))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

if (config.NODE_ENV === 'development') {
    // disable caching in development
    app.set('etag', false)

    app.use(routingMiddleware.devRouter)
} else {
    app.use(routingMiddleware.prodRouter)
}

app.get('/api/data', (req, res) => {
    setTimeout(() => {
        return res
        .status(OK)
        .json({ data: [ 'foo', 'bar', 'baz' ] })
    }, 1000)
})

// Testing auth middleware, remove soon
const authMiddleware = require('./middleware/auth').verifyTokenMidleware
app.get('/api/secret', authMiddleware, (req, res) => {
    res.status(200).json({ data: 'this is secret!', ...req.user })
})

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
    console.log('unhandledRejection', error.message)
    server.kill()
});

module.exports = {
    initServer,
}

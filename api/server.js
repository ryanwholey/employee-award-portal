const _ = require('lodash')
const bodyParser = require('body-parser')
const express = require('express')
const httpProxy = require('http-proxy')
const { OK } = require('http-status-codes')
const morgan = require('morgan')

const config = require('./config')
const knex = require('../db/knex')
const routes = require('./routes')

const app = express()

app.use(morgan(config.LOGGER_SETTINGS))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

if (config.NODE_ENV === 'development') {
    // disable caching in development
    app.set('etag', false)

    // send non api requests to webpack-dev-server
    const proxy = httpProxy.createProxyServer()

    app.use((req, res, next) => {
        
        if (!req.originalUrl.startsWith('/api')) {
            return proxy.web(req, res, { target:  config.WEBPACK_DEV_URL })
        }

        next()
    })
} else {
    // route static production assets
}

app.get('/api/data', (req, res) => {
    setTimeout(() => {
        return res
        .status(OK)
        .json({ data: [ 'foo', 'bar', 'baz' ] })
    }, 1000)
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

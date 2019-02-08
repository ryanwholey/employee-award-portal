const _ = require('lodash')
const bodyParser = require('body-parser')
const express = require('express')
const httpProxy = require('http-proxy')
const { OK } = require('http-status-codes')
const morgan = require('morgan')

const config = require('./config')
const knex = require('../db/knex')
const routes = require('./routes')
const awards = require('../lib/awards.js')

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

/* json in the client request body should include:
    - "type": the award type
    - "creator": email address of the award creator
    - "recipient": email address of the recipient
    - "granted": date the award will be granted, format = mm/dd/yyyy
       (defaults to current date if omitted) */
app.post('/api/awards', (req, res) => {
    const params = {
        "type": req.body.type,
        "creator": req.body.creator,
        "recipient": req.body.recipient,
        "granted": req.body.granted
    };

    awards.createAward(params)
        .then(() => {
            console.log("Yay! the award was created");
            res.status(201).send('Award was created');
        })
        .catch(() => {
            console.log('Error creating award');
            res.status(501).send('Error creating award');
        });
});

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

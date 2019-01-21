const express = require('express')
const app = express()
const httpProxy = require('http-proxy');
const morgan = require('morgan')

const API_PORT = process.env.API_PORT || 4000
const NODE_ENV = process.env.NODE_ENV

app.use(morgan('dev'))

if (NODE_ENV === 'development') {
    // disable caching in development
    app.set('etag', false)

    // send non api requests to webpack-dev-server
    const proxy = httpProxy.createProxyServer()

    app.use((req, res, next) => {
        
        if (!req.originalUrl.startsWith('/api')) {
            return proxy.web(req, res, { target: 'http://localhost:8080' })
        }

        next()
    })
} else {
    // route static production assets
}

app.get('/api/data', (req, res) => {
    setTimeout(() => {
        return res.status(200).json({ data: [ 'foo', 'bar', 'baz' ] })
    }, 1000)
})

app.listen(API_PORT, (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`${NODE_ENV} api started at ${API_PORT}`)
})

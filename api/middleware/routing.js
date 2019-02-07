const httpProxy = require('http-proxy')
const path = require('path')
const config = require('../config')
const fs = require('fs')
const { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } = require('http-status-codes')
const mime = require('mime')

let proxy
let cache
if (process.env.NODE_ENV === 'development') {
    proxy = httpProxy.createProxyServer()
} else {
    cache = {}
}

function devRouter(req, res, next) {

    // continue onward with api calls
    if (req.originalUrl.startsWith('/api')) {
        return next()
    }

    // otherwise defer to webpack to handle asset requests
    return proxy.web(req, res, { target:  config.WEBPACK_DEV_URL })
}

function prodRouter(req, res, next) {
    // continue onward with api calls
    if (req.originalUrl.startsWith('/api')) {
        return next()
    }

    if (req.originalUrl.startsWith('/static')) {
        let urlPath = req.baseUrl + req.path

        try {
            urlPath = urlPath.replace('/static', '/build')

            const fileName = path.join(__dirname, '../../frontend', urlPath)
            
            let content
            if (cache[fileName]) {
                content = cache[fileName]
            } else {
                content = fs.readFileSync(fileName, 'utf8')
                cache[fileName] = content
            }

            res.set('Content-Type', mime.getType(fileName))
           
            return res.status(OK).send(content)
        } catch (err) {
            console.log(err)
            return res.status(NOT_FOUND).send()
        }
    }

    try {
        const htmlPath = path.join(__dirname, '../../frontend', 'index.html')
        let content
        if (cache[htmlPath]) {
            content = cache[htmlPath]
        } else {
            content = fs.readFileSync(htmlPath, 'utf8')
            cache[htmlPath] = content
        }

        res.status(OK).send(content)
    } catch (err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).send()
    }
}

module.exports = {
    devRouter,
    prodRouter,
}

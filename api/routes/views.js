const express = require('express')
const fs = require('fs')
const httpProxy = require('http-proxy')
const { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } = require('http-status-codes')
const mime = require('mime')
const path = require('path')

const config = require('../config')

const router = express.Router()

let proxy
let cache
if (process.env.NODE_ENV === 'development') {
    proxy = httpProxy.createProxyServer()
} else {
    cache = {}
}

function getAsset(fileName, cache) {
    let content
    if (cache[fileName]) {
        content = cache[fileName]
    } else {
        // TODO promisify
        content = fs.readFileSync(fileName, 'utf8')
        cache[fileName] = content
    }
    return content
}

function respondWithAsset(req, res) {
    if (process.env.NODE_ENV === 'development') {
        return proxy.web(req, res, { target:  config.WEBPACK_DEV_URL })
    }

    if (req.originalUrl.startsWith('/static')) {
        let urlPath = req.baseUrl + req.path

        try {
            const fileName = path.join(__dirname, '../../frontend', urlPath)
            const content = getAsset(fileName, cache)
            
            res.set('Content-Type', mime.getType(fileName))
           
            return res.status(OK).send(content)
        } catch (err) {
            console.log(err)
            return res.status(NOT_FOUND).send()
        }
    }

    try {
        const htmlPath = path.join(__dirname, '../../frontend', 'index.html')
        const content = getAsset(htmlPath, cache)

        return res.status(OK).send(content)
    } catch (err) {
        console.error(err)
        return res.status(INTERNAL_SERVER_ERROR).send()
    }
}

function requireLogin(req, res, next) {
    if (!req.user) {
        return res.redirect('/login')
    }
    next()
}

function redirectIfAdmin(req, res, next) {
    if (!req.user) {
        return res.redirect('/login')
    }
    
    if (req.user.isAdmin && !req.originalUrl.startsWith('/admin')) {
        return res.redirect('/admin')
    }

    next()
}

function redirectIfNotAdmin(req, res, next) {
    if (!req.user) {
        return res.redirect('/login')
    }
    if (!req.user.isAdmin) {
        return res.redirect('/')
    }
    next()
}

// redirect to home pages if user is already logged in
router.get('/login', (req, res, next) => {
    if (!req.user) {
        return next()
    }
    if (req.user.isAdmin) {
        res.redirect('/admin')
    } else {
        res.redirect('/')
    }
})

// unauthenticated views
router.get([
    '/login',
    '/reset_password',
    '/static*',
], respondWithAsset)

// ensure authenticated and authorized
router.use(requireLogin)
router.get('/admin*', redirectIfNotAdmin)
router.get('*', redirectIfAdmin)

// assume auth ok, render views
router.get('*', respondWithAsset)



module.exports = router

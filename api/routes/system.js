const _ = require('lodash')
const express = require('express')
const { OK, BAD_REQUEST } = require('http-status-codes')
const authMiddleware = require('../middleware/auth')


const knex = require('../../db/knex')

const router = express.Router()

router.get('/system/check', (req, res) => {
    return res
    .status(OK)
    .json({
        status: 'ok'
    })
})

router.get('/system/dbconn', (req, res) => {
    return knex.raw('show tables')
    .then((data) => {
        res.status(OK).send()
    })
})

// Testing app, remove soon
router.post('/system/post', (req, res) => {
    if (_.isEmpty(req.body)) {
        return res
        .status(BAD_REQUEST)
        .json({ stats: 'no body found'})
    }

    return res
    .status(OK)
    .json({ body: req.body })
    
})

// Testing app, remove soon
router.get('/system/data', (req, res) => {
    setTimeout(() => {
        return res
        .status(OK)
        .json({ data: [ 'foo', 'bar', 'baz' ] })
    }, 1000)
})

// Testing auth middleware, remove soon
router.get('/system/secret', authMiddleware.assertLoggedIn, (req, res) => {
    res.status(200).json({ data: 'this is secret!', ...req.user })
})

module.exports = router

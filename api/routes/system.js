const _ = require('lodash')
const express = require('express')
const { OK, BAD_REQUEST } = require('http-status-codes')

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

module.exports = router

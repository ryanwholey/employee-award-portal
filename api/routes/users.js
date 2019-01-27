const _ = require('lodash')
const express = require('express')
const { 
    BAD_REQUEST,
    CONFLICT,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND, 
    OK, 
} = require('http-status-codes')

const { 
    DuplicateEntryError,
    NotFoundError, 
} = require('../../services/errors')
const userService = require('../../services/users')

const router = express.Router()

router.get('/users/:id', async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id)

        return res.status(OK).json(user)
    } catch (err) {

        if (err.isJoi) {
            return res.status(BAD_REQUEST).json({ error: err.details })
        } else if (err instanceof NotFoundError) {
            return res.status(NOT_FOUND).json({ error: 'User not found' })
        }

        console.error(err)
        return res.status(INTERNAL_SERVER_ERROR).json({ error: 'Service is temporarily unavailable' })
    }
})

router.post('/users', async (req, res) => {
    try {
        const user = await userService.createUser(req.body)

        return res.status(OK).json(user)
    } catch (err) {

        if (err.isJoi) {
            return res.status(BAD_REQUEST).json({ error: err.details })
        } else if (err instanceof DuplicateEntryError) {
            return res.status(CONFLICT).json({ error: 'User already exists' })
        }

        console.error(err)
        return res.status(INTERNAL_SERVER_ERROR).json({ error: 'Service is temporarily unavailable' })
    }
})

module.exports = router

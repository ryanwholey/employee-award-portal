const _ = require('lodash')
const express = require('express')
const { assertIsAdmin } = require('../middleware/auth')
const { 
    BAD_REQUEST,
    CONFLICT,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND, 
    OK, 
} = require('http-status-codes')
const Joi = require('joi')

const { 
    DuplicateEntryError,
    NotFoundError, 
} = require('../../services/errors')
const userService = require('../../services/users')

const router = express.Router()

router.get('/users/:id', async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id)

        return res.status(OK).json({ data: user })
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

router.get('/users', async (req, res) => {
    const pageSize = req.query.page_size
    const page = req.query.page
    const paginationOptions = _.pickBy({ pageSize, page }, _.identity)

    const queryParams = {
        ids: _.get(req, 'query.ids', '').split(',').filter(_.identity)
    }

    try {
        const users = await userService.getUsers(queryParams, paginationOptions)

        res.status(OK).json(users)
    } catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(BAD_REQUEST).json({ error: err.message })
        }

        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).send()
    }
})

router.post('/users', async (req, res) => {
    try {
        const user = await userService.createUser(req.body)

        return res.status(OK).json(user)
    } catch (err) {

        if (err.isJoi) {
            console.log(err)
            return res.status(BAD_REQUEST).json({ error: err.details })
        } else if (err instanceof DuplicateEntryError) {
            return res.status(CONFLICT).json({ error: 'User already exists' })
        }

        console.error(err)
        return res.status(INTERNAL_SERVER_ERROR).json({ error: 'Service is temporarily unavailable' })
    }
})

router.patch('/users/:id', assertIsAdmin, async (req, res) => {
    try {
        Joi.validate(req.params.id, Joi.number().required().label('id'))
    } catch (err) {
        res.status(BAD_REQUEST).send({error: err.message})
    }
    
    console.log(req.body)

    try {
        const user = await userService.patchUserById(req.params.id, req.body)

        return res.status(OK).json({ data: user })
    } catch (err) {
        if (err instanceof DuplicateEntryError) {
            return res.status(CONFLICT).json({ error: err.message })
        }

        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
})

router.delete('/users/:id', assertIsAdmin, async (req, res) => {
    try {
        Joi.validate(req.params.id, Joi.number().required().label('id'))
    } catch (err) {
        res.status(BAD_REQUEST).send({error: err.message})
    }

    try {
        const user = await userService.deleteUserById(req.params.id)

        return res.status(OK).json({ data: user })
    } catch (err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
})

module.exports = router

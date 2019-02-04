const _ = require('lodash')
const express = require('express')
const { 
    BAD_REQUEST,
    CREATED,
    INTERNAL_SERVER_ERROR, 
    NOT_FOUND,
    OK, 
    CONFLICT 
} = require('http-status-codes')
const Joi = require('joi')

const regionService = require('../../services/regions')
const { DuplicateEntryError, NotFoundError } = require('../../services/errors')

const router = express.Router()

router.get('/regions/:id', async (req, res) => {
    const createRregionSchema = Joi.number().required().label('id')

    try {
        await Joi.validate(req.params.id, createRregionSchema)
    } catch (err) {
        return res.status(BAD_REQUEST).send(err.message)
    }

    try {
        const region = await regionService.getRegionById(req.params.id)

        res.status(OK).json({ data: region })
    } catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(NOT_FOUND).json({ error: err.message })
        }

        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).send()
    }
})

router.get('/regions', async (req, res) => {
    const pageSize = req.query.page_size
    const page = req.query.page
    const paginationOptions = _.pickBy({ pageSize, page }, _.identity)
    
    try {
        const regions = await regionService.getRegions(paginationOptions)

        res.status(OK).json(regions)
    } catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(BAD_REQUEST).json({ error: err.message })
        }

        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).send()
    }
})

router.post('/regions', async (req, res) => {
    const createRregionSchema = Joi.object().keys({
        description: Joi.string().required().label('description'),
    })

    try {
        await Joi.validate(req.body, createRregionSchema)
    } catch (err) {
        return res.status(BAD_REQUEST).send(err.message)
    }

    const {
        description,
    } = req.body

    try {
        const region = await regionService.createRegion({ description })

        return res.status(OK).json({ data: region })
    } catch (err) {

        if (err instanceof DuplicateEntryError) {
            return res.status(CONFLICT).json({ error: err.message })
        }

        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
})

router.delete('/regions/:id', async (req, res) => {
    const deleteRegionSchema = Joi.object().keys({
        id: Joi.number().required().label('id'),
    })

    try {
        await Joi.validate(req.params, deleteRegionSchema)
    } catch (err) {
        return res.status(BAD_REQUEST).send(err.message)
    }
    const { id } = req.params

    try {
        await regionService.deleteRegionById(id)

        return res.status(CREATED).send()
    } catch (err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
})

module.exports = router

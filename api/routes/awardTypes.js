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

const awardTypeService = require('../../services/awardTypes')
const { DuplicateEntryError, NotFoundError } = require('../../services/errors')

const router = express.Router()

router.get('/award_types/:id', async (req, res) => {
    const getAwardTypeSchema = Joi.number().required().label('id')

    try {
        await Joi.validate(req.params.id, getAwardTypeSchema)
    } catch (err) {
        return res.status(BAD_REQUEST).send(err.message)
    }

    try {
        const awardType = await awardTypeService.getAwardTypeById(req.params.id)

        res.status(OK).json({ data: awardType })
    } catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(NOT_FOUND).json({ error: err.message })
        }

        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).send()
    }
})

router.get('/award_types', async (req, res) => {
    const pageSize = req.query.page_size
    const page = req.query.page
    const paginationOptions = _.pickBy({ pageSize, page }, _.identity)
    
    try {
        const awardTypes = await awardTypeService.getAwardTypes(paginationOptions)

        res.status(OK).json(awardTypes)
    } catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(BAD_REQUEST).json({ error: err.message })
        }

        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).send()
    }
})

router.post('/award_types', async (req, res) => {
    const createAwardTypeSchema = Joi.object().keys({
        name: Joi.string().required().label('name'),
    })

    try {
        await Joi.validate(req.body, createAwardTypeSchema)
    } catch (err) {
        return res.status(BAD_REQUEST).send(err.message)
    }

    const {
        name,
    } = req.body

    try {
        const awardType = await awardTypeService.createAwardType({ name })

        return res.status(OK).json({ data: awardType })
    } catch (err) {

        if (err instanceof DuplicateEntryError) {
            return res.status(CONFLICT).json({ error: err.message })
        }

        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
})

router.patch('/award_types/:id', async (req, res) => {
    const patchAwardTypeParamSchema = Joi.object().keys({
        id: Joi.number().required().label('id'),
    })

    try {
        await Joi.validate(req.params, patchAwardTypeParamSchema)
    } catch (err) {
        return res.status(BAD_REQUEST).send(err.message)
    }

    const patchAwardTypeBodySchema = Joi.object().keys({
        name: Joi.string().required().label('name'),
    })

    try {
        await Joi.validate(req.body, patchAwardTypeBodySchema)
    } catch (err) {
        return res.status(BAD_REQUEST).send(err.message)
    }

    const id = req.params.id
    const name = req.body.name

    try {
        const awardType = await awardTypeService.patchAwardTypeById(id, req.body)

        return res.status(OK).json({ data: awardType })
    } catch (err) {

        if (err instanceof DuplicateEntryError) {
            return res.status(CONFLICT).json({ error: err.message })
        }

        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
})

// This route turns out to be quite dangerous, disabling for now

// router.delete('/award_types/:id', async (req, res) => {
//     const deleteAwardTypeSchema = Joi.object().keys({
//         id: Joi.number().required().label('id'),
//     })

//     try {
//         await Joi.validate(req.params, deleteAwardTypeSchema)
//     } catch (err) {
//         return res.status(BAD_REQUEST).send(err.message)
//     }
//     const { id } = req.params

//     try {
//         await awardTypeService.deleteAwardTypeById(id)

//         return res.status(CREATED).send()
//     } catch (err) {
//         console.error(err)
//         res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
//     }
// })

module.exports = router

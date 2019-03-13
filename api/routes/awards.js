const express = require('express');
const _ = require('lodash');
const Joi = require('joi')
const {
    DuplicateEntryError,
    NotFoundError,
} = require('../../services/errors');
const {
    BAD_REQUEST,
    CREATED,
    INTERNAL_SERVER_ERROR,
} = require('http-status-codes')
const awardService = require('../../services/awards')
const { assertIsNotAdmin } = require('../middleware/auth')

const router = express.Router();

/* json in the client request body should include:
    - "type": the award type
    - "creator": email address of the award creator
    - "recipient": email address of the recipient
    - "granted": date the award will be granted, format = mm/dd/yyyy
       (defaults to current date if omitted) */
router.post('/awards', assertIsNotAdmin, (req, res) => {
    const params = {
        "type": req.body.type,
        "creator": req.body.creator,
        "recipient": req.body.recipient,
        "granted": req.body.granted
    };
    
    return awardService.createAward(params)
        .then((award) => {
            return res.status(201).json({ data: award })
        })
        .catch((err) => {
            console.error(err)
            console.log('Error creating award');
            res.status(501).json({ error: 'Error creating award' });
        })
});

router.get('/awards/', async (req, res) => {
    const pageSize = req.query.page_size;
    const page = req.query.page;
    const paginationOptions = _.pickBy({pageSize, page}, _.identity);

    const queryParams = {
        ids: _.get(req, 'query.ids', '').split(',').filter(_.identity)
    };

    try {
        const awards = await awardService.selectAwards(queryParams, paginationOptions);

        res.status(200).json(awards)
    } catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(400).json({error: err.message})
        }
        return res.status(500).json({error: err.message})
    }
});

router.delete('/awards/:id', async (req, res) => {
    const deleteAwardSchema = Joi.object().keys({
        id: Joi.number().required().label('id'),
    })

    try {
        await Joi.validate(req.params, deleteAwardSchema)
    } catch (err) {
        return res.status(BAD_REQUEST).send(err.message)
    }
    const { id } = req.params

    try {
        await awardService.deleteAwardById(id)

        return res.status(CREATED).json({
            data: id,
        })
    } catch (err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
})



module.exports = router
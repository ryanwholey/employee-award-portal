const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {
    DuplicateEntryError,
    NotFoundError,
} = require('../../services/errors');

const awardService = require('../../services/awards')

/* json in the client request body should include:
    - "type": the award type
    - "creator": email address of the award creator
    - "recipient": email address of the recipient
    - "granted": date the award will be granted, format = mm/dd/yyyy
       (defaults to current date if omitted) */
router.post('/awards', (req, res) => {
    const params = {
        "type": req.body.type,
        "creator": req.body.creator,
        "recipient": req.body.recipient,
        "granted": req.body.granted
    };

    awardService.createAward(params)
        .then(() => {
            console.log("Yay! the award was created");
            res.status(201).send('Award was created');
        })
        .catch(() => {
            console.log('Error creating award');
            res.status(501).send('Error creating award');
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



module.exports = router
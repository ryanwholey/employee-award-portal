const express = require('express')
const router = express.Router()

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
        });
});

router.get('/awards/', (req, res) => {
    awardService.selectAwards()
        .then((val) => {
            console.log("Finished selecting awards");
            res.status(203).send(`Check console for selections. Val = ${val.join('\n')}`);
        })
        .catch(val => {
            console.log('Error selecting awards');
            res.status(501).send('Error selecting awards. Val = ' + val);
        })
});

module.exports = router
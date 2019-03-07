const cron = require('node-cron')
const moment = require('moment')
const awardService = require('../services/awards')
const {
    DuplicateEntryError,
    NotFoundError,
} = require('../services/errors');

function scheduleMail() {
    cron.schedule("* * * * *", async function() {
        console.log('I did a thing at ' + moment(Date.now()).format('hh:mm:ss'));
        try {
            const awards = await awardService.selectAwardsToMail();
            console.log(JSON.stringify(awards));

            //res.status(200).json(awards)
        } catch (err) {
            if (err instanceof NotFoundError) {
                //return res.status(400).json({error: err.message})
                console.log(JSON.stringify({error: err.message}));
            }
            //return res.status(500).json({error: err.message})
            console.log(JSON.stringify({error: err.message}));
        }
    })
}

module.exports = {
    scheduleMail,
};

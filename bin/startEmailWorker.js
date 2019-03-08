const cron = require('node-cron')
const moment = require('moment')
const awardService = require('../services/awards')
const mailService = require('../services/emails')
const {
    DuplicateEntryError,
    NotFoundError,
} = require('../services/errors');

function scheduleAwards() {
    cron.schedule("* * * * *", async function() {
        //console.log('I did a thing at ' + moment(Date.now()).format('hh:mm:ss'));
        try {
            const awards = await awardService.selectAwardsToMail();
            if (awards.data.length > 0) {
                console.log('FOUND AWARDS TO SCHEDULE');
                let params;
                for(var record=0; record<awards.data.length; record++) {
                    var thisRecord = awards.data[record];
                    console.log('ID: ' + thisRecord.id + ', TYPE: ' + thisRecord.type);

                    params = {
                        "scheduled_time": thisRecord.granted,
                        "award": thisRecord.id,
                        "recipient": thisRecord.recipient
                    };
                    try {
                        const mailer = await mailService.scheduleMail();
                    } catch (err) {
                        if (err instanceof NotFoundError) {
                            //return res.status(400).json({error: err.message})
                            console.log(JSON.stringify({error: err.message}));
                        }
                        //return res.status(500).json({error: err.message})
                        console.log(JSON.stringify({error: err.message}));
                    }

                }
            }

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
    scheduleAwards,
};

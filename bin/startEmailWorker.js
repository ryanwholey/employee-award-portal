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

                let params = awards.data;
                for(var record=0; record<params.length; record++){
                    params[record].scheduled_time = params[record].granted;
                    params[record].award = params[record].id;
                    delete params[record].granted;
                    delete params[record].id;
                    delete params[record].type;
                    delete params[record].creator;
                }
                console.log("REFACTORED ARRAY: " + JSON.stringify(params));

                try {
                    //const mailer = await mailService.scheduleMail(awards);
                    const mailer = await mailService.scheduleMail(params);
                    console.log('MAILER = ' + mailer);
                } catch (err) {
                    if (err instanceof NotFoundError) {
                        console.log(JSON.stringify({error: err.message}));
                    }
                    console.log(JSON.stringify({error: err.message}));
                }
            }

            console.log(JSON.stringify(awards));

            //res.status(200).json(awards)
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.log(JSON.stringify({error: err.message}));
            }
            console.log(JSON.stringify({error: err.message}));
        }
    })
}

module.exports = {
    scheduleAwards,
};

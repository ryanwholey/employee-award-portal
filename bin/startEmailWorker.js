const cron = require('node-cron')
const moment = require('moment')
const awardService = require('../services/awards')
const mailService = require('../services/emails')
const mailCertificate = require('../services/mailCertificate')
const filer = require('../services/filer')
const dateUtil = require('../utils/date')
const {
    DuplicateEntryError,
    NotFoundError,
} = require('../services/errors');

function scheduleAwards() {
    cron.schedule("* * * * *", async function() {
        try {
            const awards = await awardService.selectAwardsToMail();
            if (awards.data.length > 0) {
                console.log('FOUND AWARDS TO SCHEDULE');

                let params = awards.data;
                for(var record=0; record<params.length; record++){
                    now = dateUtil.formatMySQLDatetime(moment(new Date()));

                    params[record].scheduled_time = params[record].granted;
                    params[record].award = params[record].id;
                    params[record].ctime = now;
                    delete params[record].granted;
                    delete params[record].type;
                    delete params[record].creator;
                }
                console.log("REFACTORED ARRAY: " + JSON.stringify(params));

                try {
                    const mailer = await mailService.scheduleMail(params);
                    console.log('MAILER = ' + mailer);

                } catch (err) {
                    if (err instanceof NotFoundError) {
                        console.log(JSON.stringify({error: err.message}));
                    }
                    console.log(JSON.stringify({error: err.message}));
                }
            }

            //console.log(JSON.stringify(awards));

            try {
                //Update award records to indicate they have been scheduled
                let params = awards.data;
                if (params.length > 0) {
                    const updateAwards = await awardService.updateAwardScheduled(params);
                }

            } catch (err) {
                if (err instanceof NotFoundError) {
                    console.log(JSON.stringify({error: err.message}));
                }
                console.log(JSON.stringify({error: err.message}));
            }

        } catch (err) {
            if (err instanceof NotFoundError) {
                console.log(JSON.stringify({error: err.message}));
            }
            console.log(JSON.stringify({error: err.message}));
        }

        try {
            //Check if there is email to be sent
            const emails = await mailService.getMailToSend();
            let result = emails.data;

            /*for(var record=0;record<result.length;record++) {
                let thisRecord = JSON.stringify(result[record]);
                console.log("RECORD " + record + "= " + thisRecord);
            }*/
            if(result.length > 0) {
                try {
                    //Try sending the emails
                    console.log('I\'ll try sending the emails now');
                    let filename;
                    for (var record = 0; record < result.length; record++) {
                        filename = result[record].award + '.pdf';
                        console.log("FILENAME: " + filename);
                        let attachmentContent = await filer.getFileB64(filename);
                        const attachmentData = [{"content": attachmentContent, "filename": filename,
                            "type": 'plain/text', "disposition": 'attachment', "content_id": 'award'}];
                        let emailParams = {
                            "email": result[record].email, "recipient_name": result[record].recipient_name,
                            "creator_name": result[record].creator_name, "name": result[record].name,
                            "attachment": attachmentData,
                        };
                        //console.log("EMAIL PARAMS: " + JSON.stringify(emailParams));
                        const emailSend = await mailCertificate.sendCertEmail(emailParams);
                        let updated = await mailService.updateSentMail(result[record].email_id);
                    }

                } catch (err) {
                    if (err instanceof NotFoundError) {
                        console.log(JSON.stringify({error: err.message}));
                    }
                    console.log(JSON.stringify({error: err.message}));
                }
            }

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

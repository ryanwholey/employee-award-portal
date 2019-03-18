const _ = require('lodash')
const mailer = require('@sendgrid/mail')
const knex = require('../db/knex')
const dateUtil = require('../utils/date')

async function sendCertEmail(emailParams = {}) {
    console.log("Now processing an email");
    const fromUser = 'award-generator@employee-award-portal.com';
    const msg = _.pickBy ( {
        to: emailParams.email,
        from: fromUser,
        subject: 'You received an Employee Award!',
        text: 'Hi, ' + emailParams.recipient_name + '.\n' + emailParams.creator_name +
            ' has awarded you a certificate for ' + emailParams.name +'. \nCongratulations!',
        attachments: emailParams.attachment,
    })
    return mailer.send(msg)
        .catch((err) => {
            console.error(err)
            throw err
        })
}


module.exports = {
    sendCertEmail,
}
const emailer = require('../lib/emailer')
const knex = require('../db/knex')
const dateUtil = require('../utils/date')

async function sendCertEmail(emailParams = {}) {
    console.log("Now processing an email");
    return emailer.send({
        to: emailParams.email,
        subject: 'You received an Employee Award!',
        text: 'Hi, ' + emailParams.recipient_name + '.\n' + emailParams.creator_name +
            ' has awarded you a certificate for ' + emailParams.name +'.\nCongratulations!',
    })
}

module.exports = {
    sendCertEmail,
}
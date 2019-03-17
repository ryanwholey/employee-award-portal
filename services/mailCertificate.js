const emailer = require('../lib/emailer')
const knex = require('../db/knex')
const dateUtil = require('../utils/date')

async function sendCertEmail(emailParams = {}) {
    return emailer.send({
        to: email,
        subject: 'You received an Employee Award!',
        text: ``,
    })
}

module.exports = {
    sendCertEmail,
}
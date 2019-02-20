const _ = require('lodash')
const mailer = require('@sendgrid/mail')

mailer.setApiKey(process.env.SENDGRID_API_KEY)

/**
 * @param {string} params.to        - email address to mail to
 * @param {string} params.subject   - subject of email
 * @param {string} params.message   - content of email
 * @returns {Promise} Promise object
 */
function send(params) {
    const fromUser = params.fromUser || 'award-generator'
    const msg = _.pickBy({
        to: params.to,
        from: `${fromUser}@employee-award-portal.com`,
        subject: params.subject,
        text: params.text,
        html: params.html,
    }, _.identity)

    return mailer.send(msg)
    .catch((err) => {
        console.error(err)
        throw err
    })
}

function emailSuccess(result) {
    console.log('Email successfully sent');
}

function emailFailed(error) {
    console.log('Error creating or scheduling email: ' + error);
}

module.exports = {
    send,
    emailSuccess,
    emailFailed,
}

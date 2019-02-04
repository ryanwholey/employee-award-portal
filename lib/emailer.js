/**
 * @param {string} params.email     - email address
 * @param {string} params.subject   - subject of email
 * @param {string} params.message   - content of email
 * @returns {Promise} Promise object
 */
function send(params) {
    console.log('Fake sending email...');
    return Promise.resolve()
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
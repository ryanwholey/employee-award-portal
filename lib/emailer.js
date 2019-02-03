/**
 * @param {string} params.email     - email address
 * @param {string} params.subject   - subject of email
 * @param {string} params.message   - content of email
 * @returns {Promise} Promise object
 */
function send(params) {
    console.log('Fake sending email...')
    return Promise.resolve()
}

module.exports = {
    send
}

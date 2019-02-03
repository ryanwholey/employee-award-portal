const moment = require('moment')

function formatMySQLDatetime(momentDate) {
    if (!momentDate instanceof moment ) {
        throw new Error('formatMySQLDatetime must take a moment object')
    }

    return momentDate.format('YYYY-MM-DD HH:mm:ss')
}

module.exports = {
    formatMySQLDatetime
}

require('dotenv').config()

const config = {
    API_PORT: process.env.API_PORT || (process.env.NODE_ENV === 'test' ? 5432 : null) || 4000,
    NODE_ENV: process.env.NODE_ENV,
    LOGGER_SETTINGS: 'dev',
    REQUEST_TIMEOUT: 5000,
    WEBPACK_DEV_URL: process.env.WEBPACK_DEV_URL || 'http://localhost:8080',
}

module.exports = config

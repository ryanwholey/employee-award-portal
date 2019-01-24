require('dotenv').config()

module.exports = {
    development: {
        client: 'mysql',
        connection: process.env.DB_CONNECTION_STRING
    },
    test: {
        client: 'mysql',
        connection: process.env.DB_CONNECTION_STRING
    },
    production: {
        client: 'mysql',
        connection: process.env.DB_CONNECTION_STRING
    }
}

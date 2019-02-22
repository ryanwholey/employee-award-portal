require('dotenv').config()

const baseConfig = {
    client: 'mysql',
    migrations: {
        tableName: 'migrations',
        directory: 'db/migrations',
    }
}

module.exports = {
    development: {
        ...baseConfig,
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            port: process.env.DB_PORT,
            password: process.env.DB_PASS,
            database: 'eap',
        }
    },
    test: {
        ...baseConfig,
        connection: {
            host: '127.0.0.1',
            user: 'root',
            port: process.env.IS_CI ?  process.env.DB_PORT : '3346',
            password: process.env.DB_PASS,
            database: 'eap',
        }
    },
    production: {
        ...baseConfig,
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            port: process.env.DB_PORT,
            password: process.env.DB_PASS,
            database: 'eap',
        }
    },
}

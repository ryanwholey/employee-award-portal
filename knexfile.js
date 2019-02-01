require('dotenv').config()

const baseConfig = {
    migrations: {
        tableName: 'migrations',
        directory: 'db/migrations',
    }
}

module.exports = {
    development: {
        ...baseConfig,
        client: 'mysql',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            port: process.env.DB_PORT,
            database: 'eap',
        }
    },
    test: {
        ...baseConfig,
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            port: process.env.IS_CI ?  process.env.DB_PORT : '3346',
            database: 'eap',
        }
    },
    production: {
        ...baseConfig,
        client: 'mysql',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        }
    }
}

require('dotenv').config()
const fs = require('fs')
const path = require('path')

if (process.env.NODE_ENV === 'production') {
    console.log('This script should not be run in production at the moment')
    process.exit(1)
}

const { connection } = require('../../knexfile')[process.env.NODE_ENV || 'development']
const config = {
    client: 'mysql',
    connection: {
        host: connection.host,
        port: connection.port,
        user: connection.user,
        multipleStatements: true
    }
}

const knex = require('knex')(config)

async function main() {
    console.log('knex config:')
    console.log(JSON.stringify(config, null, 4))

    const rawSchema = fs.readFileSync(path.join(__dirname, '../eap_creation_script.sql')).toString()

    try {
        await knex.raw(rawSchema)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }

    console.log('Initialization successful')
    knex.destroy()
}

main()

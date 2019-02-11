const moment = require('moment');
require('dotenv').config();

const { connection } = require('../knexfile')[process.env.NODE_ENV || 'development']
const config = {
    client: 'mysql',
    connection: {
        host: connection.host,
        port: connection.port,
        user: connection.user,
        database: 'eap',
        multipleStatements: true
    }
};

const knex = require('knex')(config);

module.exports.selectAwards = () => {
    console.log('I\'ll try selecting awards');
    //const thisTime = moment(Date.now());
    return knex.from('awards')
        .select("id", "type", "creator", "recipient", "granted")
        /*.where(knex.raw('?? < ?', ['granted', thisTime]))*/
        .then((rows) => {
            for (row of rows) {
                console.log(`${row['id']} ${row['type']} ${row['creator']} ${row['recipient']} ${row['granted']}`);
            }
        })
        .catch((err) => { console.log( err); throw err })
};
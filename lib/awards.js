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

/**
 * @param {string} params.type      - type of award
 * @param {string} params.creator   - email address of award creator
 * @param {string} params.recipient - email address of award recipient
 * @param {string} params.granted   - date award is to be granted
 * @returns {Promise} Promise object
 */
module.exports.createAward = (params) => {
    console.log("I\'ll try adding an award...");
    //const mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    //params['ctime'] = mysqlTimestamp;
    const data = [params];
    knex('awards').insert(data).then(() => console.log("data inserted"))
        .catch((err) => { console.log(err); throw err })
        .finally(() => {
            knex.destroy();
        });
    console.log('Past the INSERT statement');
    return new Promise((resolve, reject) => {
        val=1;
        console.log('inside the promise, success = ' + val);
        if(val) {
            console.log('inside the conditional, success = ' + val);
            resolve("AWARD")
        } else {
            reject("**no award**")
        }
    })
};
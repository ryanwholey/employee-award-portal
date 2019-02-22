const moment = require('moment');
const knex = require('../db/knex')

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
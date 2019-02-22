const knex = require('../db/knex')

function selectAwards() {
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


/**
 * @param {string} params.type      - type of award
 * @param {string} params.creator   - email address of award creator
 * @param {string} params.recipient - email address of award recipient
 * @param {string} params.granted   - date award is to be granted
 * @returns {Promise} Promise object
 */
function createAward(params) {
    console.log("I\'ll try adding an award...");
    //const mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    //params['ctime'] = mysqlTimestamp;
    const data = [params];
    knex('awards').insert(data).then(() => console.log("data inserted"))
        .catch((err) => { console.log(err); throw err })
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

module.exports = {
    createAward,
    selectAwards,
}

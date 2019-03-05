const knex = require('../db/knex')
const _ = require('lodash')

const { NotFoundError, DuplicateEntryError } = require('./errors')

function selectAwards() {
    console.log('I\'ll try selecting awards');
    //const thisTime = moment(Date.now());
    return knex.from('awards')
        .select("id", "type", "creator", "recipient", "granted")

        /*.where(knex.raw('?? < ?', ['granted', thisTime]))*/
        .then((rows) => {
            return JSON.stringify((rows) => {
                return `{\"id\": ${row.id}, \"type\": \"${row.type}\", \"creator\": \"${row.creator}",
                    \"recipient\": \"${row.recipient}\", \"granted\": \"${row.granted}}\"`;
            });
        })
        .catch((err) => { console.log( err); throw err })
};


async function selectAwards(queryParams = {}, pageOptions = {}) {
    const defaultPageOptions = {
        pageSize: 10,
        page: 1,
    };
    const options = {
        ...defaultPageOptions,
        ...pageOptions,
    };

    const pageSize = options.pageSize;
    const page = options.page < 1 ? 1: options.page;

    const countQuery = knex('awards')
        .count('*')
        .whereNull('dtime');

    if(!_.isEmpty(queryParams.ids)) {
        countQuery
            .whereIn('id', queryParams.ids)
    }

    const [ res ] = await countQuery;

    const count = res['count(*)'];
    const totalPages = Math.ceil(count / pageSize) || 1;

    if (page > totalPages) {
        throw new NotFoundError(`Page ${page} requested, total pages ${totalPages}`)
    }
    const offset = (pageSize * page) - pageSize;
    const query = knex('awards')
        .select(['id', 'type', 'creator', 'recipient', 'granted'])
        .offset(offset)
        .limit(pageSize)
        .whereNull('dtime')

    if(!_.isEmpty(queryParams.ids)) {
        query
            .whereIn('id', queryParams.ids)
    }

    return {
        pagination: {
            page,
            page_size: pageSize,
            total_pages: totalPages,
        },
        data: await query,
    }
}

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

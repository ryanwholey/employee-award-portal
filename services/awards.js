const knex = require('../db/knex');
const _ = require('lodash');
const moment = require('moment');
const Joi = require('joi')
const dateUtil = require('../utils/date')

const { NotFoundError, DuplicateEntryError } = require('./errors')

//Retrieve all awards that meet queryParams
async function selectAwards(queryParams = {}, pageOptions = {}) {
    /*const thisTime = moment(Date.now());
    console.log('time = ' + thisTime);
    let sqlTime = thisTime.format('YYYY-MM-DD HH:mm:ss');
    console.log('sqlTime = ' + sqlTime);*/
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

//Retrieve all awards created before now that are not in the emails table
//I could make this a particular case within selectAwards(), but would take more time
async function selectAwardsToMail() {
    const subQ1 = knex.select('*')
        .from('awards')
        .whereNull('dtime')
        .whereRaw('TIMEDIFF(NOW(), granted) > 0')
        .as('beforeNow');

    const query2 = knex.select('beforeNow.id','beforeNow.type','beforeNow.creator','beforeNow.recipient',
        'beforeNow.granted')
        .from(subQ1)
        .joinRaw('LEFT JOIN emails on beforeNow.id=emails.id')
        .whereRaw('emails.id IS NULL');

    //DEBUGGING: will output the constructed sql query
    /*const toStringQuery1 = query1.toString();
    console.log('NEW QUERY = ' + toStringQuery1);
    const toStringQuery2 = query2.toString();
    console.log('BIG QUERY = ' + toStringQuery2);*/

    return {
        data: await query2,
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
    // console.log("I\'ll try adding an award...");
    //const mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    //params['ctime'] = mysqlTimestamp;
    // const now = 
    // console.log(params)
    // const data = [params];
    // const update = {
    //     ...params,
    //     ctime: now,
    // }
    return knex('awards')
    .insert({
        ...params,
        ctime: dateUtil.formatMySQLDatetime(moment(new Date())),
    })
    // .then(() => console.log("data inserted"))
    //     .catch((err) => { console.log(err); throw err })
    // console.log('Past the INSERT statement');
    // return new Promise((resolve, reject) => {
    //     val=1;
    //     console.log('inside the promise, success = ' + val);
    //     if(val) {
    //         console.log('inside the conditional, success = ' + val);
    //         resolve("AWARD")
    //     } else {
    //         reject("**no award**")
    //     }
    // })
};

async function selectAwardsByUser(userId, queryParams = {filter: []}, pageOptions = {}) {
    const defaultPageOptions = {
        pageSize: 10,
        page: 1,
    }
    const options = {
        ...defaultPageOptions,
        ...pageOptions,
    }

    const pageSize = options.pageSize
    const page = options.page < 1 ? 1: options.page
    await Joi.validate(userId, Joi.number().required().label('userId'))

    const query = knex('awards')
    .whereNull('dtime')

    const { filters } = queryParams

    if ((filters.includes('sent') && filters.includes('received')) || _.isEmpty(filters)) {
        query
        .where({ creator: userId })
        .orWhere({ recipient: userId })
    } else if (filters.includes('sent')) {
        query
        .where({ creator: userId })
    } else {
        query
        .where({ recipient: userId })
    }
    

    let countQuery = query.clone()
    countQuery.count('*')
    const [ res ] = await countQuery

    const count = res['count(*)']
    const totalPages = Math.ceil(count / pageSize) || 1;

    if (page > totalPages) {
        throw new NotFoundError(`Page ${page} requested, total pages ${totalPages}`)
    }
    const offset = (pageSize * page) - pageSize;

    query
    .offset(offset)
    .limit(pageSize)

    return {
        pagination: {
            page,
            page_size: pageSize,
            total_pages: totalPages,
        },
        data: await query,
    }
}

module.exports = {
    createAward,
    selectAwards,
    selectAwardsByUser,
    selectAwardsToMail,
}

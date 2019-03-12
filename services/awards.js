const knex = require('../db/knex');
const _ = require('lodash');
const moment = require('moment');
const Joi = require('joi')
const dateUtil = require('../utils/date')
const childProcess = require('child_process')
const path = require('path')

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
async function createAward(params) {
    const now = dateUtil.formatMySQLDatetime(moment(new Date()))

    const award = await knex('awards')
    .insert({
        ...params,
        granted: params.granted || now,
        ctime: now,
    })
    .then(([ id ]) => ({
        ...params,
        id,
        granted: params.granted || now,
        ctime: now,
    }))
    
    const users = await knex('users')
        .whereIn('id', [award.recipient, award.creator])

    const [awardType] = await knex('award_types')
        .where({id: award.type})

    const recipient = users.find(user => user.id === award.recipient)
    const creator = users.find(user => user.id === award.creator)

    const cmd = [
        `${path.resolve(__dirname, '../node_modules/.bin/babel-node')}`,
        `${path.resolve(__dirname, '../bin/createPdf.js')}`,
        `--filename="${award.id}"`,
        `--award-type-name="${awardType.name}"`,
        `--granted="${award.granted}"`,
        `--recipient-name="${recipient.first_name} ${recipient.last_name}"`,
        `--creator-name="${creator.first_name} ${creator.last_name}"`,
        `--signature-url="http://fakeurl.com"`
    ]
    console.log('going in', process.env.NODE_ENV)
    if (process.env.NODE_ENV !== 'test') {
        console.log('executing')
        childProcess.exec(cmd.join(' '), (error, stdout, stderr) => {
            if (error) {
                console.error(`Error creating pdf: ${error}`);
                return
            }
            console.log(stdout)
        })
    }

    return award
}

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

async function deleteAwardById(awardId) {
    return await knex('awards')
    .where({ id: awardId })
    .whereNull('dtime')
    .update({
        'dtime': dateUtil.formatMySQLDatetime(moment(new Date()))
    })
}

module.exports = {
    createAward,
    deleteAwardById,
    selectAwards,
    selectAwardsByUser,
    selectAwardsToMail,
}

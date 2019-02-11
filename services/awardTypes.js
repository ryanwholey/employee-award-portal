const moment = require('moment')

const dateUtil = require('../utils/date')
const knex = require('../db/knex')
const { DuplicateEntryError, NotFoundError } = require('./errors')


async function getAwardTypeById(awardTypeId) {
    const awardType = await knex('award_types')
    .where({ id: awardTypeId })
    .whereNull('dtime')
    .first()

    if (!awardType) {
        throw new NotFoundError(`Award type with id ${awardTypeId} not found.`)
    }

    return awardType
}

async function getAwardTypes(pageOptions = {}) {
    const defaultPageOptions = {
        pageSize: 10,
        page: 1,
    }
    const options = {
        ...defaultPageOptions,
        ...pageOptions,
    }

    const pageSize = options.pageSize
    const page = options.page < 1 ? 1 : options.page
    const [ res ] = await knex('award_types')
    .count('*')
    .whereNull('dtime')

    const count = res['count(*)']
    const totalPages = Math.ceil(count / pageSize) || 1

    if (page > totalPages) {
        throw new NotFoundError(`Page ${page} requested, total pages ${totalPages}`)
    }
    const offset = (pageSize * page) - pageSize
    const awardTypes = await knex('award_types')
    .offset(offset)
    .limit(pageSize)
    .whereNull('dtime')

    return {
        pagination: {
            page,
            page_size: pageSize,
            total_pages: totalPages,
        },
        data: awardTypes,
    }
}

async function createAwardType(awardTypeAttrs) {

    try {
        const [ awardTypeId ] = await knex('award_types')
        .insert(awardTypeAttrs)

        return {
            id: awardTypeId,
            ...awardTypeAttrs,
        }
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            throw new DuplicateEntryError(err.message)
        }

        throw err
    }
}

async function patchAwardTypeById(awardTypeId, awardTypeAttrs) {
    const now = moment(new Date())

    try {
        return await knex('award_types')
        .where({ id: awardTypeId })
        .whereNull('dtime')
        .update({
            ...awardTypeAttrs,
            mtime: dateUtil.formatMySQLDatetime(now),
        })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            throw new DuplicateEntryError(err.message)
        }

        throw err
    }
}

async function deleteAwardTypeById(awardTypeId) {
    const now = moment(new Date())

    return await knex('award_types')
    .where({ id: awardTypeId })
    .whereNull('dtime')
    .update({
        dtime: dateUtil.formatMySQLDatetime(now)
    })
}

module.exports = {
    createAwardType,
    deleteAwardTypeById, 
    getAwardTypeById,
    getAwardTypes,
    patchAwardTypeById,
}

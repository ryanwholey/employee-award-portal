const moment = require('moment')

const knex = require('../db/knex')
const { DuplicateEntryError, NotFoundError, PageNotFound } = require('./errors')
const dateUtil = require('../utils/date')


async function getRegionById(regionId) {
    const region = await knex('regions')
    .where({
        id: regionId
    })
    .whereNull('dtime')
    .first()

    if (!region) {
        throw new NotFoundError(`Region with ${regionId} not found`)
    }

    return region
}

async function getRegions(pageOptions = {}) {
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
    const [ res ] = await knex('regions')
    .count('*')
    .whereNull('dtime')

    const count = res['count(*)']
    const totalPages = Math.ceil(count / pageSize) || 1

    if (page > totalPages) {
        throw new NotFoundError(`Page ${page} requested, total pages ${totalPages}`)
    }
    const offset = (pageSize * page) - pageSize
    const regions = await knex('regions')
    .offset(offset)
    .limit(pageSize)
    .whereNull('dtime')

    return {
        pagination: {
            page,
            page_size: pageSize,
            total_pages: totalPages,
        },
        data: regions,
    }
}

async function createRegion(regionAttrs) {
    try {
        const [ regionId ] = await knex('regions')
        .insert(regionAttrs)

        return {
            id: regionId,
            ...regionAttrs
        }
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            throw new DuplicateEntryError(err.message)
        }

        throw err
    }
}

async function deleteRegionById(regionId) {
    const now = moment(new Date())

    return await knex('regions')
    .where({ id: regionId })
    .whereNull('dtime')
    .update({
        dtime: dateUtil.formatMySQLDatetime(now)
    })
}

module.exports = {
    createRegion,
    deleteRegionById,
    getRegionById,
    getRegions,
}

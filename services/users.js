const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const moment = require('moment')

const knex = require('../db/knex')
const dateUtil = require('../utils/date')
const { NotFoundError, DuplicateEntryError } = require('./errors')

const idSchema = Joi.number().label('id')


function returnUserObject(attrs) {
    const userAttrs = _.pick(attrs, [
        'id',
        'first_name',
        'last_name',
        'region',
        'email',
        'signature',
        'ctime'
    ])

    const defaultContainer = {
        region: null,
    }

    return {
        ...defaultContainer,
        ...userAttrs,
    }
}

async function changePassword(userId, password) {
    const passwordFields = await getPasswordSaltAndHash(password)

    return knex('users')
    .where({ id: userId })
    .update(passwordFields)
}

function parseImage(base64Data) {
    if (!base64Data) {
        return
    }
    const pivot = base64Data.indexOf(',')
    const protocol = base64Data.slice(0, pivot)
    const data = base64Data.slice(pivot + 1)
    const extension = protocol.split('/')[1].split(';')[0]

    return {
        extension,
        data,
    }
}

function saveSignature(parsedImage, userId, cb) {
    if (!parsedImage) {
        return
    }

    const mediaSignaturesDir = path.resolve(__dirname, '../media/signatures')
    const fileName = path.join(mediaSignaturesDir, `${userId}.${parsedImage.extension}`)

    fs.writeFile(fileName, parsedImage.data, 'base64', function(err) {
        if (err) {
            console.log(err)
        }
        cb && cb()
    })
}

async function createUser(attrs) {
    await Joi.validate(attrs, Joi.object().keys({
        email: Joi.string().email({ minDomainAtoms: 2 }).label('email'),
        first_name: Joi.string().required().label('first_name'),
        last_name: Joi.string().required().label('last_name'),
        password: Joi.string().required().label('password'),
        is_admin: Joi.number().valid([0, 1]).label('is_admin'),
        region: [ Joi.number().label('region'), Joi.allow(null) ],
        signature_file_content: Joi.any().allow(null),
    }))
    
    const userAttrs = _.pickBy({
        ..._.pick(attrs, ['email', 'first_name', 'last_name', 'region', 'is_admin']),
        ...(await getPasswordSaltAndHash(attrs.password)),
    }, _.identity)
    
    try {
        const [ id ] = await knex('users')
        .insert(userAttrs)

        const parsedImage = parseImage(attrs.signature_file_content)
        // don't "await" wait for decoding and saving (too slow)
        if (parsedImage) {
            await new Promise((res, rej) => {
                saveSignature(parsedImage, id, async () => {
                    res()
                })
            })
            await knex('users')
            .insert({
                signature: `/media/signatures/${id}.${parsedImage.extension}`
            })

            return returnUserObject({ id, ...attrs})
        } else {
            return returnUserObject({ id, ...attrs})
        }

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            throw new DuplicateEntryError()
        }

        throw err
    }
}

async function getPasswordSaltAndHash(password) {
    const salt = await bcrypt.genSalt(10)
    const passhash = await bcrypt.hash(password, salt);
    
    return {
        salt,
        passhash,
    }
}

async function getUserByEmail(email) {
    let user
    try {
        user = await knex('users')
        .where({ email })
        .whereNull('dtime')
        .first()
    } catch (err) {
        return null
    }

    if (!user) {
        throw new NotFoundError()
    }

    return user
}

async function getUserByEmailAndPassword(email, password) {
    let user

    try {
        user = await getUserByEmail(email)
    } catch (err) {
        return null
    }

    if (!user) {
        return null
    }
    
    const isCorrect = await bcrypt.compare(password, user.passhash)

    return isCorrect ? user : null
}

async function getUserById(id) {
    await Joi.validate(id, idSchema)
    console.log('id')
    console.log(id)
    const user = await knex('users')
    .select(
        'id',
        'email',
        'first_name',
        'last_name',
        'is_admin',
        'region',
        'signature',
        'ctime',
    )
    .where({ id })
    .whereNull('dtime')
    .first()

    if (!user) {
        throw new NotFoundError()
    }

    return returnUserObject(user)
}

async function getUsers(queryParams = {}, pageOptions = {}) {
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

    const countQuery = knex('users')
    .count('*')
    .whereNull('dtime')

    if (!_.isEmpty(queryParams.ids)) {
        countQuery
        .whereIn('id', queryParams.ids)
    }

    const [ res ] = await countQuery

    const count = res['count(*)']
    const totalPages = Math.ceil(count / pageSize) || 1

    if (page > totalPages) {
        throw new NotFoundError(`Page ${page} requested, total pages ${totalPages}`)
    }
    const offset = (pageSize * page) - pageSize
    const query = knex('users')
    .select(['ctime', 'first_name', 'last_name', 'is_admin', 'id', 'region', 'mtime', 'email', 'signature'])
    .offset(offset)
    .limit(pageSize)
    .whereNull('dtime')

    if (!_.isEmpty(queryParams.ids)) {
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

async function patchUserById(userId, userAttrs) {
    const now = moment(new Date())

    try {
        const parsedImage = parseImage(userAttrs.signature_file_content)
        if (parsedImage) {
            saveSignature(parsedImage, userId)
        }

        return await knex('users')
        .where({ id: userId })
        .whereNull('dtime')
        .update({
            ..._.pick(userAttrs, ['first_name', 'last_name', 'email', 'is_admin', 'region']),
            ...(parsedImage ? { signature: `/media/signatures/${userId}.${parsedImage.extension}`}: {}),
            mtime: dateUtil.formatMySQLDatetime(now),
        })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            throw new DuplicateEntryError(err.message)
        }

        throw err
    }
}

async function deleteUserById(userId) {
    const now = moment(new Date())

    return await knex('users')
    .where({ id: userId })
    .whereNull('dtime')
    .update({
        dtime: dateUtil.formatMySQLDatetime(now)
    })
}


module.exports = {
    changePassword,
    createUser,
    deleteUserById,
    getPasswordSaltAndHash,
    getUserByEmail,
    getUserByEmailAndPassword,
    getUserById,
    getUsers,
    patchUserById,
}

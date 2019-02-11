const _ = require('lodash')
const bcrypt = require('bcrypt')
const Joi = require('joi')

const knex = require('../db/knex')
const { NotFoundError, DuplicateEntryError } = require('./errors')

const idSchema = Joi.number().label('id')
const createUserSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).label('email'),
    first_name: Joi.string().required().label('first_name'),
    last_name: Joi.string().required().label('last_name'),
    password: Joi.string().required().label('password'),
    is_admin: Joi.number().valid([0, 1]).label('is_admin'),
    region: [ Joi.number().label('region'), Joi.allow(null) ],
})

function returnUserObject(attrs) {
    const userAttrs = _.pick(attrs, [
        'id',
        'first_name',
        'last_name',
        'region',
        'email',
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

async function createUser(attrs) {
    await Joi.validate(attrs, createUserSchema)

    const userAttrs = _.pickBy({
        ..._.pick(attrs, ['email', 'first_name', 'last_name', 'region', 'is_admin']),
        ...(await getPasswordSaltAndHash(attrs.password)),
    }, _.identity)

    try {
        const [ id ] = await knex('users')
        .insert(userAttrs)

        return returnUserObject({ id, ...attrs})
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

    const user = await knex('users')
    .select(
        'id',
        'email',
        'first_name',
        'last_name',
        'is_admin',
        'region',
    )
    .where({ id })
    .first()

    if (!user) {
        throw new NotFoundError()
    }

    return returnUserObject(user)
}

module.exports = {
    changePassword,
    createUser,
    createUserSchema,
    getPasswordSaltAndHash,
    getUserByEmail,
    getUserByEmailAndPassword,
    getUserById,
}

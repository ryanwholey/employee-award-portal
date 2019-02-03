const _ = require('lodash')
const Joi = require('joi')

const knex = require('../db/knex')
const { NotFoundError, DuplicateEntryError } = require('./errors')

// TODO use node bcrypt
function getPasswordSaltAndHash(password) {
    return {
        salt: '12345',
        passhash: password
    }
}

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

    if (user === undefined) {
        throw new NotFoundError()
    }

    return returnUserObject(user)
}

async function createUser(attrs) {
    await Joi.validate(attrs, createUserSchema)

    const userAttrs = _.pickBy({
        ..._.pick(attrs, ['email', 'first_name', 'last_name', 'region', 'is_admin']),
        ...getPasswordSaltAndHash(attrs.password),
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

async function getUserByEmail(email) {
    return knex('users')
    .where({ email })
    .then((users) => {
        const [ user ] = users

        if (!user) {
            throw new Error('No user found')
        }

        return user
    })
    .catch(() => {
        return null
    })
}

async function getUserByEmailAndPassword(email, password) {
    // todo implement real password retrieval
    return knex('users')
    .where({ email })
    .then((users) => {
        const [ user ] = users

        if (!user) {
            throw new Error('No user found')
        }

        return user
    })
    .catch(() => {
        return null
    })
}

async function changePassword(userId, password) {
    return knex('users')
    .where({ id: userId })
    // todo implement real password hash
    .update({ passhash: password })
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

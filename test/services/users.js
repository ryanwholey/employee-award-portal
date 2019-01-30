const _ = require('lodash')

const createTestUser = require('../utils/createUser')
const knex = require('../../db/knex')
const { NotFoundError, DuplicateEntryError } = require('../../services/errors')
const userService = require('../../services/users')

describe('UserService', () => {
    describe('getUserById', () => {
        it('should get a user by id', () => {
            return createTestUser()
            .then((user) => {
                return Promise.all([
                    user,
                    userService.getUserById(user.id)
                ])
            })
            .then(([testUser, createdUser]) => {
                expect(testUser.id).toEqual(createdUser.id)
                expect(testUser.first_name).toEqual(createdUser.first_name)
                expect(testUser.last_name).toEqual(createdUser.last_name)
            })
        })

        it('should throw a NotFoundError if not found', () => {
            expect.hasAssertions()
            return userService.getUserById(3598234983)
            .catch((err) => {
                expect(err).toBeInstanceOf(NotFoundError)
            })
        })

        it('should throw a Joi validation error if passed a bad id', () => {
            expect.hasAssertions()
            return userService.getUserById('abc')
            .catch((err) => {
                expect(err.isJoi).toEqual(true)
            })
        })
    })

    describe('createUser', () => {
        it('should throw DuplicateEntryError when duplicate entries are created', () => {
            expect.hasAssertions()
            return createTestUser({ password: 'fromage' })
            .then((user) => {
                return userService.createUser({
                    ..._.pick(user, ['first_name', 'last_name', 'email']),
                    password: 'fromage',
                })
            })
            .catch((err) => {
                expect(err).toBeInstanceOf(DuplicateEntryError)
            })
        })
    })
})

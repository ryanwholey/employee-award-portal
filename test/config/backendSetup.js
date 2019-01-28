const knex = require('../../db/knex')

afterAll(() => {
    return knex.destroy()
})
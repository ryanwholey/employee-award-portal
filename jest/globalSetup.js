const knex = require('../db')

afterAll(() => {
    return knex.destroy()
})

exports.up = function(knex, Promise) {
    return knex.schema.alterTable('regions', (table) => {
        table.datetime('ctime', 6).defaultTo(knex.fn.now(6)).alter()
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('regions', (table) => {
        table.datetime('ctime', 6).nullable().alter()
    })
}

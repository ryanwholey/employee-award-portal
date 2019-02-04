
exports.up = function(knex, Promise) {
    return knex.schema.createTable('award_types', (table) => {
        table.increments().primary()
        table.datetime('ctime', 6).defaultTo(knex.fn.now(6))
        table.datetime('mtime', 6).nullable()
        table.datetime('dtime', 6).nullable()
        table.string('name').notNullable().unique()
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('award_types')
}

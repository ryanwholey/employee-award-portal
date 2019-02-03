
exports.up = function(knex, Promise) {
    return knex.schema.createTable('password_reset_flow_token', (table) => {
        table.increments().primary()
        table.datetime('ctime', 6).defaultTo(knex.fn.now(6))
        table.datetime('dtime', 6).nullable()
        table.string('flow_token').notNullable()
        table.integer('user_id').notNullable()
        table.foreign('user_id').references('users.id')
        table.index('user_id')
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('password_reset_flow_token')
}

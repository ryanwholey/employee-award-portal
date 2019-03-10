
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('awards', (table) => {
        table.integer('type').unsigned().notNullable().alter()
        table.foreign('type').references('id').inTable('award_types')
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('awards', (table) => {
        table.dropForeign('type')
        table.string('type').alter()
    })
}

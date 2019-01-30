
exports.up = function(knex, Promise) {
    return knex.raw('ALTER TABLE `users` CHANGE isadmin is_admin BOOLEAN')
}

exports.down = function(knex, Promise) {
    return kenx.raw('ALTER TABLE `users` CHANGE `is_admin` `isadmin` BINARY')
}

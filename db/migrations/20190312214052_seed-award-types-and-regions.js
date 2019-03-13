
exports.up = function(knex, Promise) {
    return knex('award_types').count('id')
    .then(([res]) => {
        if (res['count(`id`)'] === 0) {
            return knex('award_types')
            .insert([
                {
                    name: 'Employee of the Month',
                },
                {
                    name: 'Employee of the Year',
                }
            ])
        } else {
            return Promise.resolve()
        }
    })
    .then(() => knex('regions').count('id'))
    .then(([res]) => {
        if (res['count(`id`)'] === 0) {
            return knex('regions')
            .insert([
                {
                    description: 'Scranton',
                },
                {
                    description: 'Utica',
                }
            ])
        }
    })
}

exports.down = function(knex, Promise) {
    return Promise.resolve()
}

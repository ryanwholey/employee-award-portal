const knex = require('../db/knex');
const _ = require('lodash');
const moment = require('moment');

const { NotFoundError, DuplicateEntryError } = require('./errors')

async function scheduleMail(insertParams = {}) {
    console.log('This is where I\'ll schedule the mail');
    return knex('emails').insert(insertParams);
}


module.exports = {
    scheduleMail,
}
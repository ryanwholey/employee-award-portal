const knex = require('../db/knex');
const _ = require('lodash');
const moment = require('moment');

const { NotFoundError, DuplicateEntryError } = require('./errors')

async function scheduleMail(insertParams = {}) {
    console.log('This is where I\'ll schedule the mail');
    return knex('emails').insert(insertParams);
}


async function getMailToSend() {
    console.log('Checking for mail to be sent');
    const subQ1 = knex.select('award')
        .from('emails')
        .whereNull('sent')
        .whereNull('dtime')
        .as('subQ1');

    const subQ2 = knex('awards')
        .join('subQ1','subQ1.award','awards.id')
        .select('subQ1.award','awards.type','awards.creator','awards.recipient');

    const toStringQ1 = subQ1.toString();
    console.log('EMAIL subQ1 = ' + toStringQ1);
    const toStringQ2 = subQ2.toString();
    console.log('EMAIL subQ2 = ' + toStringQ2);


}


module.exports = {
    scheduleMail,
    getMailToSend,
}
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

    let subQ1 = 'Select id AS email_id, award, recipient from emails where `dtime` is null and sent is null';
    let select2 = 'select `subQ1`.`email_id`,`subQ1`.`award`,`awards`.`type`,`awards`.`creator`,' +
        '`awards`.`recipient` from `awards` ';
    let select3 = 'select `subQ2`.`email_id`,`subQ2`.`award`, `subQ2`.`type`, `subQ2`.`creator`,' +
        'CONCAT(`users`.`first_name`, " ",`users`.`last_name`) AS `creator_name`, `subQ2`.`recipient` from `users` ';
    let select4 = 'select `subQ3`.`email_id`,`subQ3`.`award`,`subQ3`.`type`,`subQ3`.`creator`,`subQ3`.`creator_name`,' +
        '`subQ3`.`recipient`, `users`.`email`, CONCAT(`users`.`first_name`," ",`users`.`last_name`) ' +
        'AS `recipient_name` from `users` ';
    let finalSelect = 'select `subQ4`.`email_id`,`subQ4`.`award`, `subQ4`.`type`, `award_types`.`name`,' +
        '`subQ4`.`creator`,`subQ4`.`creator_name`,`subQ4`.`recipient`,`subQ4`.`email`,`subQ4`.`recipient_name` ' +
        'from `award_types` ';

    const query = knex.raw(finalSelect +
        'inner join (' + select4 +
        'inner join (' + select3 +
        'inner join (' + select2 +
        'inner join (' + subQ1 + ') as `subQ1` ' +
        'on `subQ1`.`award` = `awards`.`id`) as `subQ2` on `subQ2`.`creator` = `users`.`id`) AS `subQ3` ' +
        'on `subQ3`.`recipient`=`users`.`id`) AS `subQ4` ON `subQ4`.`type`=`award_types`.`id`;');

    let results = await query;
    let result0 = results[0];
    //console.log(JSON.stringify(result0));

    /*for(var record=0;record<result0.length;record++) {
        let thisRecord = JSON.stringify(result0[record]);
        console.log("RECORD " + record + "= " + thisRecord);
    }*/

    return {
        data: result0,
    }
}


module.exports = {
    scheduleMail,
    getMailToSend,
}
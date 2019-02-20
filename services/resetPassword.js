const uuid = require('uuid/v4')
const moment = require('moment')

const emailer = require('../lib/emailer')
const knex = require('../db/knex')
const dateUtil = require('../utils/date')

async function createFlowToken(userId) {
    const flowToken = uuid()

    return await knex('password_reset_flow_token')
    .insert({
        'user_id': userId,
        'flow_token': flowToken,
    })
    .then(() => flowToken)
}

async function deleteFlowToken(flowToken) {
    const now = moment(new Date())

    return await knex('password_reset_flow_token')
    .where({ flow_token: flowToken })
    .update({ dtime: dateUtil.formatMySQLDatetime(now) })
}

async function isFlowTokenValid(flowToken, userId) {
    const hourAgo = moment(new Date()).subtract(1,'hour')
    const [ token ] = await knex('password_reset_flow_token')
    .where({ 
        user_id: userId,
        flow_token: flowToken,
    })
    .where('ctime', '>=', dateUtil.formatMySQLDatetime(hourAgo))
    .whereNull('dtime')

    return Boolean(token)
}

async function sendResetPasswordEmail(email, userId) {
    const flowToken = await createFlowToken(userId)

    return emailer.send({ 
        to: email,
        subject: 'Reset Password',
        text: `http://${process.env.API_HOST}:${process.env.API_PORT}/reset_password?flow_token=${flowToken}&user_id=${userId}`,
    })
}

module.exports = {
    createFlowToken,
    deleteFlowToken,
    isFlowTokenValid,
    sendResetPasswordEmail,
}

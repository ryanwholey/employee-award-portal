const moment = require('moment')

const resetPasswordService = require('../../services/resetPassword')
const { createUser } = require('../testUtils/entityFactory') 
const knex = require('../../db/knex')
const emailer = require('../../lib/emailer')
const dateUtil = require('../../utils/date')

describe('resetPassword', () => {
    
    describe('createFlowToken', () => {
        it('should create a flow token', async () => {
            const user = await createUser()
            const token = await resetPasswordService.createFlowToken(user.id)

            const [ actualToken ] = await knex('password_reset_flow_token')
            .where({ 
                user_id: user.id, 
                flow_token: token,
            })
            
            expect(actualToken.flow_token).toEqual(token)
        })
    })

    describe('deleteFlowToken', () => {
        it('should mark a flow token for deletion', async () => {
            const user = await createUser()
            const token = await resetPasswordService.createFlowToken(user.id)

            const [ beforeDeleteToken ] = await knex('password_reset_flow_token')
            .where({ 
                user_id: user.id, 
                flow_token: token,
            })

            expect(beforeDeleteToken.dtime).toEqual(null)

            await resetPasswordService.deleteFlowToken(token)

            const [ afterDeleteToken ] = await knex('password_reset_flow_token')
            .where({ 
                user_id: user.id, 
                flow_token: token,
            })
            
            expect(afterDeleteToken.dtime).not.toEqual(null)
        })
    })

    describe('sendResetPasswordEmail', () => {

        let emailerSendSpy

        beforeEach(() => {
            emailerSendSpy = jest.spyOn(emailer, 'send')
            .mockImplementation(() => Promise.resolve())
        })

        afterEach(() => {
            emailerSendSpy.mockRestore()
        })

        it('should create a token call the emailer lib with the appropriate messaging', async () => {
            const user = await createUser()
            await resetPasswordService.sendResetPasswordEmail(user.email, user.id)

            const [ emailerArgs ] = emailerSendSpy.mock.calls
            const [ sendOptions ] = emailerArgs

            expect(sendOptions.email).toEqual(user.email)
        })
    })

    describe('isFlowTokenValid', () => {
        
        it('should accept a valid flow token', async () => {
            const user = await createUser()
            const token = await resetPasswordService.createFlowToken(user.id)
            const isValid = await resetPasswordService.isFlowTokenValid(token, user.id)

            expect(isValid).toEqual(true)
        })

        it('should deny a valid token where a user id does not exist', async () => {
            const user = await createUser()
            const token = await resetPasswordService.createFlowToken(user.id)
            const isValid = await resetPasswordService.isFlowTokenValid(token, '123456789')

            expect(isValid).toEqual(false)
        })

        it('should deny a valid user where a token does not exist', async () => {
            const user = await createUser()
            const isValid = await resetPasswordService.isFlowTokenValid('12345', user.id)

            expect(isValid).toEqual(false)
        })

        it('should deny token that is over an hour old', async () => {
            const user = await createUser()
            const token = await resetPasswordService.createFlowToken(user.id)

            const overHourOld = moment(new Date())
            .subtract(1, 'hour')
            .subtract(1, 'minute')

            await knex('password_reset_flow_token')
            .where({
                flow_token: token,
                user_id: user.id
            })
            .update({ ctime: dateUtil.formatMySQLDatetime(overHourOld)})
           
            const isValid = await resetPasswordService.isFlowTokenValid(token, user.id)

            expect(isValid).toEqual(false)
        })

        it('should allow token that just under an hour old', async () => {
            const user = await createUser()
            const token = await resetPasswordService.createFlowToken(user.id)

            const underHourOld = moment(new Date())
            .subtract(1, 'hour')
            .add(1, 'minute')

            await knex('password_reset_flow_token')
            .where({
                flow_token: token,
                user_id: user.id
            })
            .update({ ctime: dateUtil.formatMySQLDatetime(underHourOld)})
            
            const isValid = await resetPasswordService.isFlowTokenValid(token, user.id)

            expect(isValid).toEqual(true)
        })

        it('should deny a token that has been deleted', async () => {
            const user = await createUser()
            const token = await resetPasswordService.createFlowToken(user.id)

            const dtime = moment(new Date())

            await knex('password_reset_flow_token')
            .where({
                flow_token: token,
                user_id: user.id
            })
            .update({ dtime: dateUtil.formatMySQLDatetime(dtime)})
            
            const isValid = await resetPasswordService.isFlowTokenValid(token, user.id)

            expect(isValid).toEqual(false)
        })
    })
})

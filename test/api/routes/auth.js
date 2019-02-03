const { BAD_REQUEST, OK, UNAUTHORIZED } = require('http-status-codes')
const request = require('supertest')

const resetPasswordService = require('../../../services/resetPassword')
const userService = require('../../../services/users')
const { initServer } = require('../../../api/server')
const { getMockUser } = require('../../mocks')


describe('POST /api/login_tokens', () => {

    let server

    beforeEach(() => {
        server = initServer()
    })

    afterEach(() => {
        return server.close()
    })

    it('should respond with BAD_REQUEST when email is missing', () => {
        return request(server)
        .post('/api/login_tokens')
        .send({ password: 'pw123' })
        .set('Accept', 'application/json')
        .expect((response) => {
            expect(response.statusCode).toEqual(BAD_REQUEST)
        })
    })

    it('should respond with BAD_REQUEST when password is missing', () => {
        return request(server)
        .post('/api/login_tokens')
        .send({ email: 'mel@email.com' })
        .set('Accept', 'application/json')
        .expect((response) => {
            expect(response.statusCode).toEqual(BAD_REQUEST)
        })
    })

    it('should respond with UNAUTHORIZED login fails', () => {
        return request(server)
        .post('/api/login_tokens')
        .send({ 
            email: 'connor@email.com',
            password: 'pw123',
        })
        .set('Accept', 'application/json')
        .expect((response) => {
            expect(response.statusCode).toEqual(UNAUTHORIZED)
        })
    })

    describe('with a successful user query', () => {

        let userServiceSpy
        let mockUser = getMockUser()

        beforeEach(() => {
            userServiceSpy = jest.spyOn(userService, 'getUserByEmailAndPassword')
            .mockImplementation(() => Promise.resolve(mockUser))
        }) 

        afterEach(() => {
            userServiceSpy.mockRestore()
        })

        it('should respond with OK when login succeeds', () => {
            return request(server)
            .post('/api/login_tokens')
            .send({ 
                email: 'connor@email.com',
                password: 'pw123',
            })
            .set('Accept', 'application/json')
            .expect((response) => {
                expect(response.statusCode).toEqual(OK)
                expect(typeof response.body.token).toEqual('string')
            })
        })
    })
})

describe('POST /api/forgot_password', () => {

    let server

    beforeEach(() => {
        server = initServer()
    })

    afterEach(() => {
        return server.close()
    })

    it('should respond with BAD_REQUEST when email is not present', () => {
        return request(server)
        .post('/api/forgot_password')
        .send({})
        .set('Accept', 'application/json')
        .expect((response) => {
            expect(response.statusCode).toEqual(BAD_REQUEST)
        })
    })

    describe('with a successful user query', () => {

        let userServiceSpy
        let resetPasswordServiceSpy
        let mockUser = getMockUser()

        beforeEach(() => {
            userServiceSpy = jest.spyOn(userService, 'getUserByEmail')
            .mockImplementation(() => Promise.resolve(mockUser))

            resetPasswordServiceSpy = jest.spyOn(resetPasswordService, 'sendResetPasswordEmail')
            .mockImplementation(() => Promise.resolve())
        }) 

        afterEach(() => {
            userServiceSpy.mockRestore()
            resetPasswordServiceSpy.mockRestore()
        })

        it('should call resetPasswordService.sendResetPasswordEmail', () => {
            return request(server)
            .post('/api/forgot_password')
            .send({ email: mockUser.email, })
            .set('Accept', 'application/json')
            .expect((response) => {
                expect(response.statusCode).toEqual(OK)
                expect(resetPasswordServiceSpy.mock.calls[0]).toEqual([mockUser.email, mockUser.id])
            })
        })
    })
})

describe('POST /api/reset_password', () => {
    let server

    beforeEach(() => {
        server = initServer()
    })

    afterEach(() => {
        return server.close()
    })

    it('should respond with BAD_REQUEST when flow_token is missing', () => {
        return request(server)
        .post('/api/reset_password')
        .send({ 
            user_id: '12345', 
            password: 'pw123',
        })
        .set('Accept', 'application/json')
        .expect((response) => {
            expect(response.statusCode).toEqual(BAD_REQUEST)
        })
    })

    it('should respond with BAD_REQUEST when user_id is missing', () => {
        return request(server)
        .post('/api/reset_password')
        .send({ 
            flow_token: '12345', 
            password: 'pw123',
        })
        .set('Accept', 'application/json')
        .expect((response) => {
            expect(response.statusCode).toEqual(BAD_REQUEST)
        })
    })

    it('should respond with BAD_REQUEST when password is missing', () => {
        return request(server)
        .post('/api/reset_password')
        .send({ 
            flow_token: '12345', 
            user_id: '12345', 
        })
        .set('Accept', 'application/json')
        .expect((response) => {
            expect(response.statusCode).toEqual(BAD_REQUEST)
        })
    })

    describe('with invalid flow token', () => {
        let resetPasswordServiceSpy

        beforeEach(() => {
            resetPasswordServiceSpy = jest.spyOn(resetPasswordService, 'isFlowTokenValid')
            .mockImplementation(() => Promise.resolve(false))
        })

        afterEach(() => {
            resetPasswordServiceSpy.mockRestore()
        })

        it('should respond with UNAUTHORIZED if token is invalid', () => {
            return request(server)
            .post('/api/reset_password')
            .send({ 
                flow_token: '6789', 
                user_id: '12345', 
                password: 'pw123',
            })
            .set('Accept', 'application/json')
            .expect((response) => {
                expect(resetPasswordServiceSpy.mock.calls[0]).toEqual(['6789', '12345'])
                expect(response.statusCode).toEqual(UNAUTHORIZED)
            })
        })
    })

    describe('with valid flow token, failure to change password', () => {
        let isFlowTokenValidSpy
        let changePasswordSpy

        beforeEach(() => {
            isFlowTokenValidSpy = jest.spyOn(resetPasswordService, 'isFlowTokenValid')
            .mockImplementation(() => Promise.resolve(true))

            changePasswordSpy = jest.spyOn(userService, 'changePassword')
            .mockImplementation(() => Promise.reject())
        })

        afterEach(() => {
            isFlowTokenValidSpy.mockRestore()
            changePasswordSpy.mockRestore()
        })

        it('should respond with OK if token is invalid', () => {
            return request(server)
            .post('/api/reset_password')
            .send({ 
                flow_token: '6789', 
                user_id: '12345', 
                password: 'pw123',
            })
            .set('Accept', 'application/json')
            .expect((response) => {
                expect(changePasswordSpy.mock.calls[0]).toEqual(['12345', 'pw123'])
                expect(response.statusCode).toEqual(BAD_REQUEST)
            })
        })
    })

    describe('with valid flow token, with successful changePassword', () => {
        let isFlowTokenValidSpy
        let changePasswordSpy
        let deleteFlowTokenSpy

        beforeEach(() => {
            isFlowTokenValidSpy = jest.spyOn(resetPasswordService, 'isFlowTokenValid')
            .mockImplementation(() => Promise.resolve(true))

            changePasswordSpy = jest.spyOn(userService, 'changePassword')
            .mockImplementation(() => Promise.resolve(true))

            deleteFlowTokenSpy = jest.spyOn(resetPasswordService, 'deleteFlowToken')
            .mockImplementation(() => Promise.resolve(true))
        })

        afterEach(() => {
            isFlowTokenValidSpy.mockRestore()
            changePasswordSpy.mockRestore()
            deleteFlowTokenSpy.mockRestore()
        })

        it('should respond with OK if token is invalid', () => {
            return request(server)
            .post('/api/reset_password')
            .send({ 
                flow_token: '6789', 
                user_id: '12345', 
                password: 'pw123',
            })
            .set('Accept', 'application/json')
            .expect((response) => {
                expect(isFlowTokenValidSpy.mock.calls[0]).toEqual(['6789', '12345'])
                expect(changePasswordSpy.mock.calls[0]).toEqual(['12345', 'pw123'])
                expect(deleteFlowTokenSpy.mock.calls[0]).toEqual(['6789'])
                expect(response.statusCode).toEqual(OK)
            })
        })
    })
})

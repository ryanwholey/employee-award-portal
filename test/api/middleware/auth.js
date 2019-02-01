const { UNAUTHORIZED } = require('http-status-codes')

const {
    verifyTokenMidleware
} = require('../../../api/middleware/auth')
const cookies = require('../../../api/lib/cookies')
const authLib = require('../../../api/lib/auth')


describe('verifyTokenMidleware', () => {

    let server
    let authLibSpy
    let cookiesSpy

    afterEach(() => {
        authLibSpy.mockRestore && authLibSpy.mockRestore()
        cookiesSpy.mockRestore && cookiesSpy.mockRestore()
    })

    it('should accept cookie as valid token', async () => {
        const user = { id: '333' }
        
        cookiesSpy = jest.spyOn(cookies, 'parseRequestForCookie')
        .mockImplementation(() => '12345')
        
        authLibSpy = jest.spyOn(authLib, 'verifyToken')
        .mockImplementation(() => Promise.resolve({ user }))

        const req = {}
        const next = jest.fn()

        await verifyTokenMidleware(req, {}, next)

        expect(req.user).toEqual(user)
        expect(authLibSpy.mock.calls[0]).toEqual(['12345'])
        expect(next.mock.calls.length).toBe(1)
    })

    it('should accept bearer token as valid token', async () => {
        const user = { id: '333' }
        const req = { 
            headers: {
                authorization: 'Bearer 12345'
            }
        }
        
        authLibSpy = jest.spyOn(authLib, 'verifyToken')
        .mockImplementation(() => Promise.resolve({ user }))

        const next =  jest.fn()
        
        await verifyTokenMidleware(req, {}, next)
        
        expect(req.user).toEqual(user)
        expect(authLibSpy.mock.calls[0]).toEqual(['12345'])
        expect(next.mock.calls.length).toBe(1)
    })
    
    it('should accept query param as valid token', async () => {
        const user = { id: '333' }
        const req = {
            headers: {},
            query: {
                token: '12345'
            }
        }
        
        authLibSpy = jest.spyOn(authLib, 'verifyToken')
        .mockImplementation(() => Promise.resolve({ user }))

        const next =  jest.fn()
        
        await verifyTokenMidleware(req, {}, next)
        
        expect(req.user).toEqual(user)
        expect(authLibSpy.mock.calls[0]).toEqual(['12345'])
        expect(next.mock.calls.length).toBe(1)
    })

    it('should reject if no were passed', async () => {
        const req = {
            headers: {},
            query: {},
        }
        const res = {
            status: jest.fn().mockImplementation(() => ({
                send: jest.fn()
            }))
        }

        const next = jest.fn()
        await verifyTokenMidleware(req, res, next)

        expect(res.status.mock.calls.length).toBe(1)
        expect(res.status.mock.calls[0]).toEqual([UNAUTHORIZED])
        expect(next.mock.calls.length).toBe(0)
    })

    it('should reject if token is invalid', async () => {
        const user = { id: '333' }
        
        cookiesSpy = jest.spyOn(cookies, 'parseRequestForCookie')
        .mockImplementation(() => '12345')
        
        authLibSpy = jest.spyOn(authLib, 'verifyToken')
        .mockImplementation(() => Promise.reject())

        const res = {
            status: jest.fn().mockImplementation(() => ({
                send: jest.fn()
            }))
        }

        const req = {}
        const next = jest.fn()

        await verifyTokenMidleware(req, res, next)

        expect(authLibSpy.mock.calls.length).toBe(1)
        expect(res.status.mock.calls[0]).toEqual([UNAUTHORIZED])
        expect(next.mock.calls.length).toBe(0)
    })
})
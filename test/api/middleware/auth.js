const {
    verifyTokenMidleware
} = require('../../../api/middleware/auth')
const cookies = require('../../../api/lib/cookies')
const authLib = require('../../../api/lib/auth')

describe('verifyTokenMidleware', () => {

    let server
    let cookiesSpy
    let authLibSpy

    afterEach(() => {
        cookiesSpy.mockRestore()
        authLibSpy.mockRestore()
    })

    it('should accept cookie as valid token', async () => {
        const user = {id: '333'}
        
        cookiesSpy = jest.spyOn(cookies, 'parseRequestForCookie')
        .mockImplementation(() => '12345')
        
        authLibSpy = jest.spyOn(authLib, 'verifyToken')
        .mockImplementation(() => Promise.resolve({ user }))

        const req = {}
        const next = jest.fn()

        await verifyTokenMidleware(req, {}, next)

        expect(req.user).toEqual(user)
        expect(next.mock.calls.length).toBe(1)
    })

    // TODO
    // it('should accept bearer token as valid token', () => {})
    // it('should accept query param as valid token', () => {})
    // it('should reject if no were passed', () => {})
    // it('should reject if token is invalid', () => {})
})
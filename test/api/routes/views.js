const { FOUND } = require('http-status-codes')
const request = require('supertest')
const { initServer } = require('../../../api/server')
const authMiddleware = require('../../../api/middleware/auth')
const { createUser } = require('../../testUtils/entityFactory')


const userService = require('../../../services/users')

describe('view routing tests', () => {
    let server
    let userServiceSpy

    beforeEach(() => {
        server = initServer()
    })

    afterEach(() => {
        userServiceSpy && userServiceSpy.mockRestore && userServiceSpy.mockRestore()
        return server.close()
    })

    it('should redirect to /login when user is not logged in', () => {
        return request(server)
        .get('/')
        .then((response) => {
            expect(response.statusCode).toEqual(302)
            expect(response.headers.location).toEqual('/login')
        })
    })

    it('should allow a logged in user to see a page' () => {})
    it('should redirect a user when requesting an admin page' () => {})
    it('should redirect an admin who tries to see a regular page', () => {})
    it('should not redirect an admin who tries to see an admin page', () => {})
})

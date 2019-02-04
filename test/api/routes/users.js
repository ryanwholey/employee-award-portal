const { BAD_REQUEST, CONFLICT, NOT_FOUND, OK } = require('http-status-codes')
const request = require('supertest')

const getJoiError = require('../../testUtils/getJoiError')
const { DuplicateEntryError } = require('../../../services/errors')
const userService = require('../../../services/users')
const { initServer } = require('../../../api/server')
const { getMockUser } = require('../../mocks')
const { NotFoundError } = require('../../../services/errors')


describe('/api/users routes', () => {
    describe('GET /api/users/:id', () => {

        let server
        let userServiceSpy

        beforeEach(() => {
            server = initServer()
        })

        afterEach(() => {
            userServiceSpy.mockRestore()
            return server.close()
        })

        it('should return 200 when user service finds a user', () => {
            const userId = 12345
            const mockUser = getMockUser(userId)

            userServiceSpy = jest.spyOn(userService, 'getUserById')
            .mockImplementation(() => Promise.resolve(mockUser))

            return request(server)
            .get(`/api/users/${userId}`)
            .then((response) => {
                expect(response.statusCode).toEqual(OK)
                expect(response.body).toEqual({ data: mockUser })
            })
        })

        it('should return 400 validation fails', () => {
            userServiceSpy = jest.spyOn(userService, 'getUserById')
            .mockImplementation(() => Promise.reject(getJoiError()))

            return request(server)
            .get('/api/users/abc')
            .expect(BAD_REQUEST)
        })

        it('should return 404 if user is not found', () => {
            userServiceSpy = jest.spyOn(userService, 'getUserById')
            .mockImplementation(() => Promise.reject(new NotFoundError()))
            
            return request(server)
            .get('/api/users/123')
            .expect(NOT_FOUND)
        })
    })

    describe('POST /api/users', () => {
        let server
        let userServiceSpy

        beforeEach(() => {
            server = initServer()
        })

        afterEach(() => {
            userServiceSpy.mockRestore()
            return server.close()
        })

        it('should return a 200 when user service returns a user', () => {
            const mockUser = getMockUser()

            userServiceSpy = jest.spyOn(userService, 'createUser')
            .mockImplementation(() => Promise.resolve(mockUser))

            return request(server)
            .post('/api/users')
            .send(mockUser)
            .set('Accept', 'application/json')
            .expect(OK)
        })

        it('should return a 400 when validatoin fails', () => {
            const mockUser = getMockUser()

            userServiceSpy = jest.spyOn(userService, 'createUser')
            .mockImplementation(() => Promise.reject(getJoiError()))

            return request(server)
            .post('/api/users')
            .send(mockUser)
            .set('Accept', 'application/json')
            .expect(BAD_REQUEST)
        })

        it('should return a 409 when duplicate user is created', () => {
            const mockUser = getMockUser()

            userServiceSpy = jest.spyOn(userService, 'createUser')
            .mockImplementation(() => Promise.reject(new DuplicateEntryError()))

            return request(server)
            .post('/api/users')
            .send(mockUser)
            .set('Accept', 'application/json')
            .expect(CONFLICT)
        })
    })
})

const { initServer } = require('./')
const { OK } = require('http-status-codes')
const request = require('supertest')

describe('GET /api/system/check', () => {
    let server

    beforeEach(() => {
        server = initServer()
    })

    afterEach(() => {
        server.close()
    })

    it('should return ok from simple GET', () => {
        return request(server)
        .get('/api/system/check')
        .then((response) => {
            expect(response.statusCode).toEqual(OK)
            expect(response.body).toEqual({ status: 'ok' })
        })
    })
})

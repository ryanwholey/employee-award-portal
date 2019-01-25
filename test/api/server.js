const { initServer } = require('../../api/server')
const { OK } = require('http-status-codes')
const request = require('supertest')

describe('GET /api/system', () => {
    let server

    beforeEach(() => {
        server = initServer()
    })

    afterEach(() => {
        return server.close()
    })

    it('should return OK from GET /api/system/check', () => {
        return request(server)
        .get('/api/system/check')
        .then((response) => {
            expect(response.statusCode).toEqual(OK)
            expect(response.body).toEqual({ status: 'ok' })
        })
    })

    it('should return OK from GET /api/system/dbconn', () => {
        return request(server)
        .get('/api/system/dbconn')
        .then((response) => {
            expect(response.statusCode).toEqual(OK)
        })
    })

    it('should return OK from POST /api/system/post', () => {
        return request(server)
        .post('/api/system/post')
        .send({ name: 'izzy' })
        .set('Accept', 'application/json')
        .expect((response) => {
            expect(response.statusCode).toEqual(OK)
        })
    })
})

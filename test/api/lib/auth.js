const authLib = require('../../../api/lib/auth')

describe('authLib', () => {
    it('should create and accept a valid token', async () => {
        const tokenPayload = { id: '123'}
        const token = await authLib.createToken(tokenPayload)
        const resolvedPayload = await authLib.verifyToken(token)

        // expect(await authLib.verifyToken(token)).to.equal(tokenPayload)
        expect(resolvedPayload.id).toEqual(tokenPayload.id)
    })

    it('should reject an invalid token', async () => {
        const tokenPayload = { id: '123'}
        const token = '123456'
        try {
            await authLib.verifyToken(token)
            expect('reached').toEqual('Not supposed to be here')
        } catch (e) {
            expect(e.name).toEqual('JsonWebTokenError')
        }
    })
})

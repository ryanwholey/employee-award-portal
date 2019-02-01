const { UNAUTHORIZED } = require('http-status-codes')

const cookieLib = require('../lib/cookies')
const authLib = require('../lib/auth')

async function verifyTokenMidleware(req, res, next) {
    let token

    // check cookie for token
    const cookieToken = cookieLib.parseRequestForCookie(req, 'eap-token')
    if (cookieToken) {
        token = cookieToken
    // otherwise check bearer authorization for token
    } else if (req.headers.authorization) {
        const [ type, payload ] = req.headers.authorization.split(' ')

        if (type === 'Bearer') {
            token = payload
        }
    // finally check query params for token
    } else if (req.query.token) {
        token = req.query.token
    }

    if (!token) {
        return res.status(UNAUTHORIZED).send()        
    }

    let tokenPayload
    try {
        tokenPayload = await authLib.verifyToken(token)
    } catch (err) {
        return res.status(UNAUTHORIZED).send()
    }

    req.user = tokenPayload.user
    next()
}

module.exports = {
    verifyTokenMidleware
}

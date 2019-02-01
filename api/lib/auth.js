const jwt = require('jsonwebtoken')

function verifyToken(token) {
    return new Promise((resolve, reject) => {

        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) {
                return reject(err)
            }
            resolve(data)
        })
    })
}

function createToken(tokenPayload, options = {}) {
    return new Promise((resolve) => {
        const defaultOptions = {
            expiresIn: 3600,
            algorithm: 'HS256',
        }

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            ...defaultOptions,
            ...options,
        })

        resolve(token)
    })
}

function getTokenFromRequest(req) {
    let token
    if (req.headers.authorization) {
        const [ type, payload ] = req.headers.authorization.split(' ')

        if (type === 'Bearer') {
            token = payload
        }
    } else if (req.query.token) {
        token = req.query.token
    }

    return token
}

module.exports = {
    createToken,
    getTokenFromRequest,
    verifyToken,
}

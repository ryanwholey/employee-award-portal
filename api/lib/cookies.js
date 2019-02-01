const Cookie = require('universal-cookie')

function parseRequestForCookie(req, cookieName) {
    let token

    const cookies = new Cookie(req.headers.cookie)
    const cookieToken = cookies.get('eap-token')

    if (cookieToken) {
        token = cookieToken
    }

    return token
}

module.exports = {
    parseRequestForCookie
}

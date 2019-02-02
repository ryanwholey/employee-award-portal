const Cookie = require('universal-cookie')

function parseRequestForCookie(req, cookieName) {
    const cookies = new Cookie(req.headers.cookie)
    return cookies.get('eap-token')
}

module.exports = {
    parseRequestForCookie
}

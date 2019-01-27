const { createUser } = require('../../services/users')

function getRandomString(len=7) {
    return Math.random().toString(36).substring(len)
}

async function createTestUser(attrs) {
    const defaultAttrs = {
        first_name: getRandomString(),
        last_name: getRandomString(),
        email: `${getRandomString()}@${getRandomString()}.com`,
        region: null,
        password: getRandomString(),
    }

    const userAttrs = {
        ...defaultAttrs,
        ...attrs,
    }

    return createUser(userAttrs)
}

module.exports = createTestUser

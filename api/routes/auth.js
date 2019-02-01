const _ = require('lodash')
const express = require('express')
const { BAD_REQUEST, OK, UNAUTHORIZED } = require('http-status-codes')

const { verifyToken } = require('../lib/auth')
const { getUserByEmailAndPassword } = require('../../services/users')
const { createToken } = require('../lib/auth')

const router = express.Router()

router.post('/login', async (req, res) => {
    if (_.isEmpty(req.body)) {
        return res.status(BAD_REQUEST).json({ error: 'Missing fields: email or password'})
    }

    const {
        email,
        password,
    } = req.body

    const user = await getUserByEmailAndPassword(email, password)

    if (!user) {
        return res.status(UNAUTHORIZED).send()
    }

    const tokenData = {
        user: _.pick(user, ['id', 'is_admin', 'first_name', 'last_name', 'email'])
    }

    const token = await createToken(tokenData)

    return res.status(OK).json({ token })
})

module.exports = router

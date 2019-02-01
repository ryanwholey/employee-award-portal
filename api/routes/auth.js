const _ = require('lodash')
const express = require('express')
const { BAD_REQUEST, OK, UNAUTHORIZED } = require('http-status-codes')

const authLib = require('../lib/auth')
const userService = require('../../services/users')

const router = express.Router()

router.post('/login', async (req, res) => {
    if (_.isEmpty(req.body)) {
        return res.status(BAD_REQUEST).json({ error: 'Missing fields: email or password'})
    }

    const {
        email,
        password,
    } = req.body

    const user = await userService.getUserByEmailAndPassword(email, password)

    if (!user) {
        return res.status(UNAUTHORIZED).send()
    }

    const tokenData = {
        user: _.pick(user, ['id', 'is_admin', 'first_name', 'last_name', 'email'])
    }

    const token = await authLib.createToken(tokenData)

    return res.status(OK).json({ token })
})

module.exports = router

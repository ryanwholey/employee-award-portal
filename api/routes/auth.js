const _ = require('lodash')
const express = require('express')
const { BAD_REQUEST, OK, UNAUTHORIZED } = require('http-status-codes')
const Joi = require('joi')

const authLib = require('../lib/auth')
const resetPasswordService = require('../../services/resetPassword')
const userService = require('../../services/users')

const router = express.Router()

router.post('/login_tokens', async (req, res) => {
    const loginSchema = Joi.object().keys({
        email: Joi.string().required().email({ minDomainAtoms: 2 }).label('email'),
        password: Joi.string().required().label('password'),
    })
    try {
        await Joi.validate(req.body, loginSchema)
    } catch (err) {
        return res.status(BAD_REQUEST).send(err.message)
    }

    const {
        email,
        password,
    } = req.body

    const user = await userService.getUserByEmailAndPassword(email, password)

    if (!user) {
        return res.status(UNAUTHORIZED).send()
    }

    const {
        id,
        is_admin: isAdmin,
        first_name: firstName,
        last_name: lastName,
    } = user

    const tokenUser = {
        id,
        isAdmin,
        firstName,
        lastName,
        email,
    }

    const tokenData = {
        user: tokenUser
    }

    const token = await authLib.createToken(tokenData)

    return res.status(OK).json({ token })
})

router.post('/forgot_password', async (req, res) => {
    const forgotEmailSchema = Joi.object().keys({
        email: Joi.string().required().email({ minDomainAtoms: 2 }).label('email'),
    })

    try {
        await Joi.validate(req.body, forgotEmailSchema)
    } catch (err) {
        return res.status(BAD_REQUEST).send(err.message)
    }

    const { email } = req.body
    let user
    try {
        user = await userService.getUserByEmail(email)
    } catch (err) {
        console.error(err)
        console.error(`/api/forgetPassword: No user found - ${email}`)
        return res.status(OK).json({})
    }
    try {
        await resetPasswordService.sendResetPasswordEmail(email, user.id)
    } catch (err) {
        console.error(err)
        console.error(`Failed to send password reset email - ${email}`)
    }

    res.status(OK).json({})
})

router.post('/reset_password', async (req, res) => {
    const forgotEmailSchema = Joi.object().keys({
        flow_token: Joi.string().required().label('flow_token'),
        user_id: Joi.number().required().label('user_id'),
        password: Joi.string().required().label('password'),
    })

    try {
        await Joi.validate(req.body, forgotEmailSchema)
    } catch (err) {
        return res.status(BAD_REQUEST).send(err.message)
    }

    const { 
        flow_token: flowToken, 
        user_id: userId, 
        password,
    } = req.body

    try {
        if (!await resetPasswordService.isFlowTokenValid(flowToken, userId)) {
            throw new Error('Could not verify flow token')
        }
    } catch (err) {
        return res.status(UNAUTHORIZED).send()
    }

    try {
        await userService.changePassword(userId, password)
    } catch (err) {
        return res.status(BAD_REQUEST).send()
    }

    await resetPasswordService.deleteFlowToken(flowToken)

    res.status(OK).json({})
})

module.exports = router

const getJoiError = (message) => {
    const err = new Error(message)
    err.isJoi = true
    return err
}

module.exports = getJoiError
const getMockUser = (attrs = {}) => ({
    id: 12345,
    first_name: 'william',
    last_name: 'macfarland',
    email: 'billymac@fyre.com',
    region: null,
    ...attrs
})

module.exports = {
    getMockUser,
}

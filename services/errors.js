class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = 'NotFoundError'
    }
}

class DuplicateEntryError extends Error {
    constructor(message) {
        super(message)
        this.name = 'DuplicateEntryError'
    }
}

module.exports = {
    NotFoundError,
    DuplicateEntryError,
}

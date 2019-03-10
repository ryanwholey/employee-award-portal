const _ = require('lodash')

const _fetchAndHandle = (...args) => {
    return fetch(...args)
    .then((res) => {
        if (!res.ok) {
            const err = new Error(res.statusText)
            err.code = res.status
            throw err
        }
        return res.json()
    })
}

const _mergeHeadersAndDefaults = (reqHeaders = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json'
    }

    return {
        ...defaultHeaders,
        ...reqHeaders
    }
}

export const fetchGet = (url, options = {}) => {
    const headerOptions = _mergeHeadersAndDefaults(options.headers)
    const { method, headers, ...restOfOptions } = options
    const fetchOptions = {
        method: 'GET',
        headers: new Headers(headerOptions),
        ...restOfOptions,
    }

    return _fetchAndHandle(url, fetchOptions)
}

export const fetchAll = (url, options = {}) => {
    return fetchGet(url, options)
    .then((body) => {
        if (body.pagination && body.pagination.total_pages > 1) {
            let range
            if (body.pagination.total_pages > 2) {
                range = _.range(2, body.pagination.total_pages + 1)
            } else {
                range = [ 2 ]
            }
            
            let queryParams = new URL(`${window.location.origin}${url}`).search.replace('?','')
            if (queryParams !== '') {
                queryParams = '&' + queryParams
            }

            return Promise.all([
                body,
                ...range.map((page) => fetchGet(`${url}?page=${page}&page_size=${body.pagination.page_size}${queryParams}`))
            ])
        } else {
            return Promise.resolve([body])
        }
    })
    .then((responses) => {
        return responses.reduce((bodies, { data }) => ([
            ...bodies,
            ...data,
        ]), [])
    })
}

export const fetchPost = (url, body, options = {}) => {
    const headerOptions = _mergeHeadersAndDefaults(options.headers)

    const { method, headers, ...restOfOptions } = options
    const fetchOptions = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers(headerOptions),
        ...restOfOptions,
    }

    return _fetchAndHandle(url, fetchOptions)
}

export const fetchPatch = (url, body, options = {}) => {
    const headerOptions = _mergeHeadersAndDefaults(options.headers)
    const { method, headers, ...restOfOptions } = options

    const fetchOptions = {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: new Headers(headerOptions),
        ...restOfOptions,
    }

    return _fetchAndHandle(url, fetchOptions)
}

export const fetchDelete = (url, body, options = {}) => {
    const headerOptions = _mergeHeadersAndDefaults(options.headers)
    const { method, headers, ...restOfOptions } = options

    const fetchOptions = {
        method: 'DELETE',
        body: JSON.stringify(body),
        headers: new Headers(headerOptions),
        ...restOfOptions,
    }

    return _fetchAndHandle(url, fetchOptions)
}

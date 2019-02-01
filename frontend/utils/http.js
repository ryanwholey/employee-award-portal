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

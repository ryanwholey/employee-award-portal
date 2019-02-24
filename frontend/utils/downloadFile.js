/**
 * Downloads a text blob using browser
 * Borrowed from https://stackoverflow.com/questions/27073661/add-and-remove-div-from-body-in-javascript
 */
export default function downloadFile(filename, contents) {
    const data = new Blob([contents], {type: 'text/csv'})
    const csvURL = window.URL.createObjectURL(data)
    const tempLink = document.createElement('a')

    tempLink.href = csvURL
    tempLink.setAttribute('download', filename)
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
}


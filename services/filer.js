const fs = require('fs')
const path = require('path')

async function getFileB64(file) {
    const fileName = path.join(__dirname, '../media/awards', file);
    let content;
    content = fs.readFileSync(fileName, 'base64')
    return content
}

module.exports = {
    getFileB64,
}
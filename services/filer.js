const fs = require('fs')

async function getFileB64(fileName) {
    data = fs.readFileSync(fileName);
    console.log(data.toString('base64'));
    return data.toString('base64');
}

module.exports = {
    getFileB64,
}
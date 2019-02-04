/**
 * @param {string} params.type      - type of award
 * @param {string} params.creator   - email address of award creator
 * @param {string} params.recipient - email address of award recipient
 * @param {string} params.granted   - date award is to be granted
 * @returns {Promise} Promise object
 */
function createAward(params) {
    console.log("I\'ll try adding an award...");
    return Promise.resolve()
}

function awardSuccess(result) {
    console.log('Award successfully created');
}

function awardFailed(error) {
    console.log('Error creating award: ' + error);
}

module.exports = {
    createAward,
    awardSuccess,
    awardFailed,
}
/**
 * @param {string} params.type      - type of award
 * @param {string} params.creator   - email address of award creator
 * @param {string} params.recipient - email address of award recipient
 * @param {string} params.granted   - date award is to be granted
 * @returns {Promise} Promise object
 */
module.exports.createAward = (params) => {
    console.log("I\'ll try adding an award...");
    return new Promise((resolve, reject) => {
        val=1;
        console.log('inside the promise, success = ' + val);
        if(val) {
            console.log('inside the conditional, success = ' + val);
            resolve("AWARD")
        } else {
            reject("**no award**")
        }
    })
};
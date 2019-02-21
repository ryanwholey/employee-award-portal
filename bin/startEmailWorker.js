const cron = require('node-cron')
const moment = require('moment')
const awardService = require('../services/awards')

cron.schedule("* * * * *", function() {
    console.log('I did a thing at ' + moment(Date.now()).format('hh:mm:ss'));

    awardService.selectAwards()
    .catch(console.error)
})

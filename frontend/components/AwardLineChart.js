import React from 'react'
import { Line } from 'britecharts-react'

import isEmpty from 'lodash/isEmpty'
import minBy from 'lodash/minBy'
import mapValues from 'lodash/mapValues'
import maxBy from 'lodash/maxBy'
import moment from 'moment'

import 'britecharts/dist/css/britecharts.min.css'


function getMomentDates(momentStart, momentEnd) {
    if (momentStart.isSame(momentEnd)) {
        return [ momentStart ]
    }
    if (momentStart.isAfter(momentEnd)) {
        let tmp = momentStart
        momentStart = momentEnd
        momentEnd = tmp
    }
    const pointer = moment(momentStart)
    let dates = []
    while(pointer.isBefore(momentEnd)) {
        dates.push(moment(pointer))
        pointer.add(1, 'day')
    }
    dates.push(moment(pointer))
    return dates
}

function getDateCounts(awards) {
    const formatByDay = 'YYYY-MM-DD'
    const momentRange = getMomentRange(awards)
    const momentDates = getMomentDates(...momentRange)
    const dateCounts = momentDates.reduce((memo, date) => ({
        ...memo,
        [date.format(formatByDay)]: 0
    }),{})
    awards.forEach(({ grantedTime }) => {
        dateCounts[moment(grantedTime).format(formatByDay)]++
    })
    return dateCounts
}

function getMomentRange(awards) {
    return [
        minBy(awards, (d) => moment(d.grantedTime).valueOf()),
        maxBy(awards, (d) => moment(d.grantedTime).valueOf()),
    ].map((award) => moment(award.grantedTime))
}

function formatData(awards) {
    const dateCounts = getDateCounts(awards)
    const dates = Object.entries(dateCounts).map(([date, value]) => ({
        date: moment(date).startOf('day').toString(),
        value,
    }))

    return {
        dataByTopic: [
            {
                topicName: 'Awards',
                topic: 1,
                dates: dates 
            },
        ]
    }
}

export default class LineChart extends React.Component {

    render() {
        const { data, ...rest } = this.props
        
        if (isEmpty(data)) {
            return null
        }

        return (
            <Line
                data={ formatData(data) }
                grid="vertical"
                yAxisLabel="Number of Awards"
                {...rest}
            />
        )
    }
}
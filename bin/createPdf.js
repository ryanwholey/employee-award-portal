import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import React from 'react'
import { render, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import yargs from 'yargs'

const argv = yargs
.options('filename', {
    describe: 'Name of the file (do not include .pdf)',
    type: 'string',
    demans: true,
})
.option('award-type-name', {
    describe: 'The name of the award-type.',
    type: 'string',
    demand: true,
})
.option('granted', {
    describe: 'Time the award was granted.',
    type: 'string',
    demand: true,
})
.option('recipient-name', {
    describe: 'Full name of the recipient.',
    type: 'string',
    demand: true,
})
.option('creator-name', {
    describe: 'Full name of the creator.',
    type: 'string',
    demand: true,
})
.option('signature-url', {
    describe: 'The url of the signature file.',
    type: 'string',
    demand: true,
})
.argv

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    container: {
        backgroundColor: '#E2F9FA',
        alignItems: 'center',
        margin: 100,
        padding: 100,
        flexGrow: 1,
        border: 3,
        opacity: 5
    },
    message: {
        fontFamily: 'Courier-Oblique',
        paddingBottom: 25
    },
    header: {
        fontFamily: 'Helvetica-Bold',
        paddingBottom: 15
    }
})

const props = _.pick(argv, [
    'awardTypeName',
    'granted',
    'recipientName',
    'creatorName',
    'signatureUrl',
])

const createDoc = (props) => {
    const {
        awardTypeName,
        granted,
        creatorName,
        recipientName,
    } = props

    return (
        <Document>
            <Page style={styles.page} orientation='landscape' size='A4'>
                <View style={styles.container}>
                    <Text style={styles.header}>Congratulations, {recipientName}!</Text>
                    <Text style={styles.message}>You've been awarded the {awardTypeName} award by {creatorName}.</Text>
                    <Text style={styles.date}>{moment(granted).format('lll')}</Text>
                </View>
            </Page>
        </Document>
    )
}

const mediaAwardsDir = path.resolve(__dirname, '../media/awards')
if (!fs.existsSync(mediaAwardsDir)){
    fs.mkdirSync(mediaAwardsDir)
}
render(createDoc(props), path.join(mediaAwardsDir, `${argv.filename}.pdf`))

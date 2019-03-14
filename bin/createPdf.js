import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import React from 'react'
import { render, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import yargs from 'yargs'
import AwardPdf from '../frontend/components/awardPdf'

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

const props = _.pick(argv, [
    'awardTypeName',
    'granted',
    'recipientName',
    'creatorName',
    'signatureUrl',
])
props.signatureUrl = path.join(__dirname, '../', props.signatureUrl) 
const mediaAwardsDir = path.resolve(__dirname, '../media/awards')
render(<AwardPdf {...props } />, path.join(mediaAwardsDir, `${argv.filename}.pdf`))

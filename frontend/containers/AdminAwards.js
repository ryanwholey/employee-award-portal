import React from 'react'
import moment from 'moment'
import get from 'lodash/get'
import ReactTable from 'react-table'

import downloadFile from '../utils/downloadFile'
import { fetchAll, fetchGet } from '../utils/http' 
import AwardLineChart from '../components/AwardLineChart'

const defaultPageOptions = {
    page: 0,
    pageSize: 10,
}

// TODO: remove when awards endpoint is finalized
const fetchAwards = (url) => {
    return fetchGet(url)
    .catch((err) => {
        return {
            pagination: {
                page: 1,
                page_size: 10,
                total_pages: 1,
            },
            body: [
                {
                    id: 1,
                    type: 1,
                    creator: 1,
                    recipient: 2,
                    granted: '2019-02-23T08:16:50.000Z',
                    ctime: '2019-01-23T08:16:50.000Z',
                },
                {
                    id: 2,
                    type: 3,
                    creator: 2,
                    recipient: 8,
                    granted: '2019-02-23T08:16:50.000Z',
                    ctime: '2019-02-23T08:16:50.000Z',
                },
                {
                    id: 3,
                    type: 1,
                    creator: 1,
                    recipient: 2,
                    granted: '2019-02-27T08:16:50.000Z',
                    ctime: '2019-02-25T08:16:50.000Z',
                },
                {
                    id: 4,
                    type: 1,
                    creator: 1,
                    recipient: 2,
                    granted: '2019-02-27T08:16:50.000Z',
                    ctime: '2019-02-27T08:16:50.000Z',
                },
                {
                    id: 5,
                    type: 1,
                    creator: 1,
                    recipient: 2,
                    granted: '2019-02-28T08:16:50.000Z',
                    ctime: '2019-02-29T08:16:50.000Z',
                },
                {
                    id: 6,
                    type: 1,
                    creator: 1,
                    recipient: 2,
                    granted: '2019-03-01T08:16:50.000Z',
                    ctime: '2019-02-29T08:16:50.000Z',
                },
                {
                    id: 7,
                    type: 1,
                    creator: 1,
                    recipient: 2,
                    granted: '2019-03-03T08:16:50.000Z',
                    ctime: '2019-02-29T08:16:50.000Z',
                },
                {
                    id: 8,
                    type: 1,
                    creator: 1,
                    recipient: 2,
                    granted: '2019-03-03T08:16:50.000Z',
                    ctime: '2019-02-29T08:16:50.000Z',
                },
                {
                    id: 9,
                    type: 1,
                    creator: 1,
                    recipient: 2,
                    granted: '2019-03-03T08:16:50.000Z',
                    ctime: '2019-02-29T08:16:50.000Z',
                },
                {
                    id: 10,
                    type: 1,
                    creator: 1,
                    recipient: 2,
                    granted: '2019-03-15T08:16:50.000Z',
                    ctime: '2019-02-29T08:16:50.000Z',
                },
            ]
        }
    })
}

const formatAwards = (awards, awardTypes, users) => {
    return awards.body.map(({id, type, creator, recipient, granted, ctime}) => ({
        id,
        awardTypeId: type,
        awardTypeName: get(awardTypes.find(({ id }) => id === type), 'name', '[deleted]'),
        creatorId: creator,
        creatorEmail: get(users.find(({ id }) => id === creator), 'email', '[deleted]'),
        recipientId: recipient,
        recipientEmail: get(users.find(({ id }) => id === recipient), 'email', '[deleted]'),
        grantedTime: granted,
        createdTime: ctime,
    }))
}

export default class AdminAwards extends React.Component {

    state = {
        awards: null,
        page: 0,
        pageSize: 10,
        totalPages: null,
        view: 'table',
    }

    fetchData = (options = {}) => {
        const pageOptions = {
            page: options.page + 1 || defaultPageOptions.page,
            pageSize: options.pageSize || defaultPageOptions.pageSize,
        }

        let awards
        let awardTypes
        Promise.all([
            fetchAll('/api/award_types'),
            fetchAwards(`/api/awards?page=${pageOptions.page}&page_size=${pageOptions.pageSize}`),
        ])
        .then(([ _awardTypes, _awards ]) => {
            awardTypes = _awardTypes
            awards = _awards

            const ids = _(awards.body)
            .chain()
            .flatMap(({creator, recipient}) => ([ creator, recipient ]))
            .uniq()
            .valueOf()

            if (_.isEmpty(ids)) {
                return Promise.resolve([])
            }

            return fetchAll(`/api/users/?ids=${ids.join(',')}`)
        })
        .then((users) => formatAwards(awards, awardTypes, users))
        .then((fullAwards) => {
            this.setState({
                page: +awards.pagination.page,
                pageSize: +awards.pagination.page_size,
                totalPages: +awards.pagination.total_pages,
                awards: fullAwards
            })
        })
        .catch(console.error)

    }
    
    handleExportToCsv = () => {
        const { awards } = this.state
        const columns = [
            {
                display: 'Award Id',
                key: 'id',
            },
            {
                display: 'Creator',
                key: 'creatorEmail',
            },
            {
                display: 'Recipient',
                key: 'recipientEmail',
            },
            {
                display: 'Granted',
                key: 'grantedTime',
            },
        ]
        const csv = [
            columns.map(({display}) => display).join(','),
            ...awards.map((award) => {
                return columns.map(({key}) => award[key]).join(',')
            })
        ].join('\n')

        downloadFile('awards.csv', csv)
    }

    handleViewChange = (e) => {
        e.preventDefault()
        this.setState({
            view: e.target.id
        })
    }

    renderGraph() {
        const { awards } = this.state

        if (_.isEmpty(awards)) {
            return null
        }

        return (
            <React.Fragment>
                <h2 style={{ 'text-align': 'center' }}>Number Awards Granted By Date</h2>
                <AwardLineChart
                    data={ awards }
                />
            </React.Fragment>
        )
    }

    renderTable() {
        const {
            awards,
            page,
            pageSize,
            totalPages,
        } = this.state

        
        return (          
            <React.Fragment>
                <button className="button" onClick={ this.handleExportToCsv }>Export to CSV</button>
                <ReactTable
                    data={ awards || [] }
                    pages={ totalPages }
                    columns={
                        [
                            {
                                columns: [
                                    {
                                        Header: 'Award Id',
                                        accessor: 'id',
                                    },
                                    {
                                        Header: 'Creator',
                                        accessor: 'creatorEmail',
                                    },
                                    {
                                        Header: 'Recipient',
                                        accessor: 'recipientEmail'
                                    },
                                    {
                                        Header: 'Granted',
                                        accessor: 'grantedTime',
                                        Cell: (row) => <span>{ moment(row.value).format('lll') }</span>
                                    }
                                ]
                            }
                        ]
                    }
                    defaultPageSize={ pageSize }
                    onFetchData={ this.fetchData }
                    className="-striped"
                >
                </ReactTable>
            </React.Fragment>
        )
    }

    render() {
        return (
            <div>
                <h1 className="header">Awards Console</h1>
                <div>
                    <a href="" className="nav-link" onClick={this.handleViewChange}><span id="table" >Table</span></a>
                    <a href="" className="nav-link" onClick={this.handleViewChange}><span id="graph" >Graph</span></a>
                </div>
                {this.state.view === 'table' ? this.renderTable() : this.renderGraph()}
            </div>
        )
    }
}
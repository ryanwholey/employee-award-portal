import React from 'react'
import moment from 'moment'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import flatMap from 'lodash/flatMap'
import uniq from 'lodash/uniq'
import ReactTable from 'react-table'

import downloadFile from '../utils/downloadFile'
import { ToastContainer, toast } from 'react-toastify'
import { fetchAll, fetchGet } from '../utils/http' 
import AwardLineChart from '../components/AwardLineChart'

const defaultPageOptions = {
    page: 0,
    pageSize: 10,
}

const formatAwards = (awards, awardTypes, users) => {
    return awards.data.map(({id, type, creator, recipient, granted, ctime}) => ({
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
            fetchGet(`/api/awards?page=${pageOptions.page}&page_size=${pageOptions.pageSize}`),
        ])
        .then(([ _awardTypes, _awards ]) => {
            awardTypes = _awardTypes
            awards = _awards

            const ids = uniq(flatMap(awards.data, ({ creator, recipient }) => ([ creator, recipient ])))

            if (isEmpty(ids)) {
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
        .catch((err) => {
            this.showToast(err.message, {type: 'error'})
        })
    }

    showToast = (message, props) => {
        toast(message, props)
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

        if (isEmpty(awards)) {
            return null
        }

        return (
            <React.Fragment>
                <h2 style={{ 'textAlign': 'center' }}>Number Awards Granted By Date</h2>
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
                    manual
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
                <ToastContainer />
            </div>
        )
    }
}
import React from 'react'
import { fetchGet } from '../utils/http'
import ReactTable from 'react-table';

import 'react-table/react-table.css'

const UserCard = ({firstName, lastName, id}) => {
    return (
        <div>
            <span>{ `${firstName} ${lastName}` }</span>
            <button>Edit</button>
            <button>Delete</button>
        </div>
    )
}

export default class AdminHome extends React.Component {

    state = {
        users: null,
        page: null,
        pageSize: null,
        totalPages: null,
    }

    componentDidMount() {
        fetchGet('/api/users')
        .then((data) => {
            const users = data.data.map((user) => ({
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                id: user.id,
                ctime: user.ctime,
                isAdmin: user.is_admin,
                region: user.region,
                mtime: user.mtime,
            }))
        
            this.setState({
                users,
                page: data.pagination.page,
                pageSize: data.pagination.page_size,
                totalPages: data.pagination.total_pages,
            })
        })
    }

    fetchData = (options) => {
        console.log(options)
        fetchGet(`/api/users?page=${options.page + 1}&page_size=${options.pageSize}`)
        .then((data) => {
            const users = data.data.map((user) => ({
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                id: user.id,
                ctime: user.ctime,
                isAdmin: user.is_admin,
                region: user.region,
                mtime: user.mtime,
            }))
        
            this.setState({
                users,
                page: data.pagination.page,
                pageSize: options.pageSize,
                totalPages: data.pagination.total_pages,
            })

            return users
        })
    }

    renderUsers() {
        const { 
            users, 
            totalPages,
        } = this.state

        if (!users) {
            return <span>Loading...</span>
        }
        
        return (
            <ReactTable
                data={users}
                pages={totalPages}
                columns={
                    [
                        {
                            columns: [
                                {
                                    Header: 'User Id',
                                    accessor: 'id',
                                },
                                {
                                    Header: 'First Name',
                                    accessor: 'firstName'
                                },
                                {
                                    Header: 'Last Name',
                                    accessor: 'lastName',
                                },
                                {
                                    Header: 'Email',
                                    accessor: 'email',
                                },
                                {
                                    Header: 'isAdmin',
                                    accessor: 'isAdmin',
                                    Cell: (row) => !!row.value ? <span>true</span> : null
                                },
                                {
                                    Header: 'Actions',
                                    Cell: (row) => (
                                        <React.Fragment>
                                            <button className="button">Edit</button>
                                            <button className="button">Delete</button>
                                        </React.Fragment>
                                    )
                                },
                            ]
                        }
                    ]
                }
                manual
                defaultPageSize={10}
                onFetchData={this.fetchData}
                className="-striped -highlight"
            >
            </ReactTable>
        )
    }

    render() {
        return (
            <div>
                <h1>hello Users</h1>
                {this.renderUsers()}
            </div>
        )
    }
}

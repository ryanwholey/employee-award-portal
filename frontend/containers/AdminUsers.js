import React from 'react'
import { fetchGet, fetchPost, fetchPatch, fetchDelete } from '../utils/http'
import ReactTable from 'react-table'
import Modal from 'react-modal'
import isEmpty from 'lodash/isEmpty'

import 'react-table/react-table.css'


const defaultPageOptions = {
    page: 0,
    pageSize: 10,
}

class EditUserForm  extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            firstName: props.formValues.firstName,
            lastName: props.formValues.lastName,
            email: props.formValues.email,
            isAdmin: props.formValues.isAdmin,
        }
    }

    handleOnChange = (e) => {
        this.props.onChange(e)

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    render() {
        const {
            firstName,
            lastName,
            email,
            isAdmin,
        } = this.state

        return (
            <form className="container container-center">
                <input type="text" name="firstName" value={firstName} placeholder="first name" onChange={this.handleOnChange} autoComplete="off" />
                <input type="text" name="lastName" value={lastName} placeholder="last name" onChange={this.handleOnChange} autoComplete="off"/>
                <input type="email" name="email" value={email} placeholder="email" onChange={this.handleOnChange} autoComplete="off" />
                <div>
                    <label htmlFor="isAdmin">Is Admin</label>
                    <input id="isAdmin" type="checkbox" placeholder="isAdmin" />
                </div>
                <div>
                    <button className="button" onClick={ this.props.onSubmit }>Save</button>
                    <button className="button" onClick={ this.props.onClose }>Close</button>
                </div>
            </form>
        )
    }

}

const CreateUserForm = ({ onChange, onSubmit, onClose }) => (
    <form className="container container-center">
        <input type="text" name="firstName" placeholder="First name" onChange={ onChange } autoComplete="off" />
        <input type="text" name="lastName" placeholder="Last name" onChange={ onChange } autoComplete="off"/>
        <input type="email" name="email" placeholder="Email" onChange={ onChange } autoComplete="off" />
        <input type="password" name="password" placeholder="Password" onChange={ onChange } autoComplete="off" />
        <input type="password" name="confirmPassword" placeholder="Confirm password" onChange={ onChange } autoComplete="off" />
        <div>
            <label htmlFor="isAdmin">Is Admin</label>
            <input id="isAdmin" type="checkbox" placeholder="isAdmin" />
        </div>
        <div>
            <button className="button" onClick={ onSubmit }>Save</button>
            <button className="button" onClick={ onClose }>Close</button>
        </div>
    </form>
)

export default class AdminHome extends React.Component {

    state = {
        users: null,
        page: 0,
        pageSize: 10,
        totalPages: null,
        showModal: false,
        form: {},
        modal: {},
    }

    componentDidMount() {
        const {
            page,
            pageSize,
        } = this.state

        this.fetchData({
            page,
            pageSize,
        })
    }

    openModal = (modalOptions) => {
        this.setState({ modalOptions })
    }

    closeModal = (e) => {
        this.setState({ modalOptions: {} })
    }

    submitEditUser = (e, ...args) => {
        e.preventDefault()
        const {
            id,
            firstName: first_name,
            lastName: last_name,
            email,
            isAdmin: is_admin,
        } = this.state.form

        fetchPatch(`/api/users/${id}`, {
           first_name,
           last_name,
           email,
           is_admin,
        })
        .then(() => {
            this.fetchData({
                page: 0,
                pageSize: 10,
            })
        })
        .then(this.closeModal)
    }

    submitCreateUser = (e) => {
        e.preventDefault()
        console.log(this.state.form)
        const {
            firstName: first_name,
            lastName: last_name,
            email,
            isAdmin: is_admin,
            password,
        } = this.state.form
        
        return fetchPost('/api/users', {
            first_name,
            last_name,
            email,
            is_admin,
            password,
        })
        .then(() => {
            this.fetchData({
                page: 0,
                pageSize: 10,
            })
        })
        .then(this.closeModal)
    }

    fetchData = (options) => {

        const pageOptions = {
            page: options.page + 1 || defaultPageOptions.page,
            pageSize: options.pageSize || defaultPageOptions.pageSize,
        }

        fetchGet(`/api/users?page=${pageOptions.page}&page_size=${pageOptions.pageSize}`)
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
        .catch(console.error)
    }

    handleFormFieldChange = (e) => {
        const name = e.target.name
        const value = e.target.value

        this.setState(({ form }) => ({
            form: {
                ...form,
                [name]: value,
            }
        }))
    }
    handleDelete = (userId) => () => {
        fetchDelete(`/api/users/${userId}`)
        .then(() => {
            this.fetchData({
                page: 0,
                pageSize: 10,
            })
        })
        .then(this.closeModal)
    }

    renderModal() {
        const {
            modalOptions
        } = this.state

        if (isEmpty(modalOptions)) {
            return 
        }

        return (
            <Modal
                isOpen={ !isEmpty(modalOptions) }
                  onRequestClose={ this.closeModal }
                  style={{
                      content : {
                          top                   : '50%',
                          left                  : '50%',
                          right                 : 'auto',
                          bottom                : 'auto',
                          marginRight           : '-50%',
                          transform             : 'translate(-50%, -50%)'
                      }
                  }}
                  contentLabel="Example Modal"
                  className="modal"
                  ariaHideApp={false}
              >
                <div className="modal-body">
                    <h2 ref={subtitle => this.subtitle = subtitle}>{ modalOptions.title }</h2>
                    {modalOptions.form}
                </div>
            </Modal>
        )
    }

    renderUsers() {
        const { 
            users, 
            pageSize,
            totalPages,
            form,
        } = this.state

        if (!users) {
            return <span>Loading...</span>
        }

        return (
            <React.Fragment>
                <button className="button" onClick={ () => this.openModal({
                    title: 'Create User',
                    form: <CreateUserForm 
                            onChange={this.handleFormFieldChange} 
                            onSubmit={this.submitCreateUser} 
                            onClose={this.closeModal}
                        />,
                }) }>Create User</button>
                <ReactTable
                    data={ users }
                    pages={ totalPages }
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
                                                <button className="button" onClick={ () => {
                                                    this.setState(
                                                        {form: row.original }, 
                                                        () => {
                                                            this.openModal({
                                                                title: 'Edit User',
                                                                form: <EditUserForm 
                                                                        onChange={this.handleFormFieldChange} 
                                                                        onSubmit={this.submitEditUser}
                                                                        onClose={this.closeModal}
                                                                        formValues={this.state.form}
                                                                    />,
                                                            }) 
                                                        }
                                                    )}}
                                                >
                                                    Edit
                                                </button>
                                                <button className="button" onClick={this.handleDelete(row.original.id)}>Delete</button>
                                            </React.Fragment>
                                        )
                                    },
                                ]
                            }
                        ]
                    }
                    manual
                    defaultPageSize={pageSize}
                    onFetchData={this.fetchData}
                    className="-striped"
                >
                </ReactTable>
                {this.renderModal()}
            </React.Fragment>
        )
    }

    render() {
        return (
            <div>
                <h1>Users Console</h1>
                {this.renderUsers()}
            </div>
        )
    }
}
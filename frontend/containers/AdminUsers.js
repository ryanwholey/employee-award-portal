import React from 'react'
import ReactTable from 'react-table'
import Modal from 'react-modal'
import isEmpty from 'lodash/isEmpty'
import { ToastContainer, toast } from 'react-toastify'


import downloadFile from '../utils/downloadFile'
import { 
    fetchAll,
    fetchGet,
    fetchPost,
    fetchPatch,
    fetchDelete,
} from '../utils/http'


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
            regionId: props.formValues.regionId,
        }
    }

    handleOnChange = (e) => {
        this.props.onChange(e)

        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value

        this.setState({
            [e.target.name]: value,
        })
    }

    render() {
        const {
            firstName,
            lastName,
            email,
            isAdmin,
            regionId,
        } = this.state

        const { regions } = this.props

        return (
            <form className="container container-center">
                <input type="text" name="firstName" value={ firstName } placeholder="first name" onChange={ this.handleOnChange } autoComplete="off" />
                <input type="text" name="lastName" value={ lastName } placeholder="last name" onChange={ this.handleOnChange } autoComplete="off"/>
                <input type="email" name="email" value={ email } placeholder="email" onChange={ this.handleOnChange } autoComplete="off" />
                <select name='regionId' value={regionId || ''} onChange={this.handleOnChange} > 
                  <option key={0} value={''}>None</option>
                  {regions.map(region => <option key={region.id} value={region.id}>{region.description}</option> )}
                </select>
                <div>
                    <label htmlFor="isAdmin">Is Admin</label>
                    <input id="isAdmin" name="isAdmin" type="checkbox" checked={ isAdmin || '' } onChange={ this.handleOnChange } />
                </div>
                <div>
                    <button className="button" onClick={ this.props.onSubmit }>Save</button>
                    <button className="button" onClick={ this.props.onClose }>Close</button>
                </div>
                 <ToastContainer />
            </form>
        )
    }
}

const CreateUserForm = ({ onChange, onSubmit, onClose, regions }) => (
    <form className="container container-center">
        <input type="text" name="firstName" placeholder="First name" onChange={ onChange } autoComplete="off" />
        <input type="text" name="lastName" placeholder="Last name" onChange={ onChange } autoComplete="off"/>
        <input type="email" name="email" placeholder="Email" onChange={ onChange } autoComplete="off" />
        <input type="password" name="password" placeholder="Password" onChange={ onChange } autoComplete="off" />
        <input type="password" name="confirmPassword" placeholder="Confirm password" onChange={ onChange } autoComplete="off" />
        <select name='regionId' onChange={ onChange } > 
          <option key={0} value={''}>None</option>
          {regions.map(region => <option key={region.id} value={region.id}>{region.description}</option> )}
        </select>
        <div>
            <label htmlFor="isAdmin">Is Admin</label>
            <input id="isAdmin" name="isAdmin" type="checkbox" onChange={ onChange } placeholder="isAdmin" />
        </div>
        <div>
            <button className="button" onClick={ onSubmit }>Save</button>
            <button className="button" onClick={ onClose }>Close</button>
        </div>
         <ToastContainer />
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
    }

    componentDidMount() {
        fetchAll('/api/regions')
        .then((regions) => {
            this.setState({
                regions
            })
        })
    }

    openModal = (modalOptions) => {
        this.setState({ modalOptions })
    }

    closeModal = (e) => {
        if (typeof e !== 'undefined' && typeof e.preventDefault === 'function') {
            e.preventDefault()
        }
        this.setState({ 
            modalOptions: {},
            form: {},
        })
    }

    submitEditUser = (e, ...args) => {
        e.preventDefault()

        const {
            id,
            firstName: first_name,
            lastName: last_name,
            email,
            regionId,
            isAdmin,
        } = this.state.form
        
        const region = regionId === '0' || regionId === '' ? null : +regionId
        const is_admin = isAdmin ? 1 : 0

        fetchPatch(`/api/users/${id}`, {
            first_name,
            last_name,
            email,
            is_admin,
            region,
        })
        .then(() => {
            this.fetchData({
                page: 0,
                pageSize: 10,
            })
        })
        .then(this.closeModal)
        .catch((err) => {
            this.showToast(err.message, {type: 'error'})
        })
    }

    submitCreateUser = (e) => {
        e.preventDefault()

        const {
            firstName: first_name,
            lastName: last_name,
            email,
            password,
            regionId,
        } = this.state.form
        
        const is_admin = this.state.form.isAdmin ? 1 : 0
        const region = regionId === '0' || regionId === '' ? null : +regionId

        return fetchPost('/api/users', {
            first_name,
            last_name,
            email,
            is_admin,
            password,
            region,
        })
        .then(() => {
            this.fetchData({
                page: 0,
                pageSize: 10,
            })
        })
        .then(this.closeModal)
        .catch((err) => {
            this.showToast(err.message, {type: 'error'})
        })
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
                regionId: user.region,
                mtime: user.mtime,
            }))

            this.setState({
                users,
                page: +data.pagination.page,
                pageSize: +options.pageSize,
                totalPages: +data.pagination.total_pages,
            })
        })
        .catch((err) => {
            this.showToast(err.message, { type: 'error' })
        })
    }

    showToast = (message, props) => {
        toast(message, props)
    }

    handleExportToCsv = () => {
        const { users } = this.state
        const columns = [
            {
                display: 'First Name',
                key: 'firstName',
            },
            {
                display: 'Last Name',
                key: 'lastName',
            },
            {
                display: 'Email',
                key: 'email',
            },
            {
                display: 'Region',
                key: 'regionId',
            },
            {
                display: 'Admin',
                key: 'isAdmin',
            },
        ]
        const csv = [
            columns.map(({display}) => display).join(','),
            ...users.map((user) => {
                return columns.map(({key}) => user[key]).join(',')
            })
        ].join('\n')

        downloadFile('users.csv', csv)
    }

    handleFormFieldChange = (e) => {
        const name = e.target.name
        let value = e.target.value

        if (e.target.type === 'checkbox') {
            value = e.target.checked
        }

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
        .catch((err) => {
            this.showToast(err.message, {type: 'error'})
        })
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
                className="modal"
                ariaHideApp={ false }
            >
                <div className="modal-body">
                    <h2 ref={subtitle => this.subtitle = subtitle}>{ modalOptions.title }</h2>
                    {modalOptions.form}
                </div>
            </Modal>
        )
    }

    handleCreateUserClick = () => this.openModal({
        title: 'Create User',
        form: <CreateUserForm
                onChange={ this.handleFormFieldChange }
                onSubmit={ this.submitCreateUser }
                onClose={ this.closeModal }
                regions={this.state.regions}
            />,
    })

    handleEditUserClick = () => {
        const {
            form,
            regions,
        } = this.state

        this.openModal({
            title: 'Edit User',
            form: <EditUserForm
                    onChange={ this.handleFormFieldChange }
                    onSubmit={ this.submitEditUser }
                    onClose={ this.closeModal }
                    formValues={ form }
                    regions={ regions}
                />,
        })
    }

    renderUsers() {
        const {
            form,
            modalOptions,
            pageSize,
            totalPages,
            users,
            regions,
        } = this.state

        if (!regions) {
            return <span>Loading...</span>
        }
        return (
            <React.Fragment>
                <button className="button" onClick={ this.handleCreateUserClick }>Create User</button>
                <button className="button" onClick={ this.handleExportToCsv }>Export to CSV</button>
                <ReactTable
                    data={ users || [] }
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
                                        Header: 'Region',
                                        accessor: 'regionId',
                                        Cell: (row) => regions && row.value ? (regions.find(({id}) => id === row.value) || { description: 'none' }).description : 'none',
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
                                                        { form: row.original },
                                                        this.handleEditUserClick,
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
                    defaultPageSize={ pageSize }
                    onFetchData={ this.fetchData }
                    className="-striped"
                    manual
                >
                </ReactTable>
                { this.renderModal() }
                { isEmpty(modalOptions) ? <ToastContainer /> : null}
            </React.Fragment>
        )
    }

    render() {
        return (
            <div>
                <h1 className="header">Users Console</h1>
                {this.renderUsers()}
            </div>
        )
    }
}

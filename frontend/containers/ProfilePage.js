import React from 'react'
import { fetchAll, fetchGet, fetchPatch } from '../utils/http'
import { ToastContainer, toast } from 'react-toastify'
import Header from '../components/Header'
import Modal from 'react-modal'

export default class ProfilePage extends React.Component {

    state = {
        shouldShowModal: false,
        form: {},
        regions: null,
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = () => {
        return Promise.all([
            fetchGet('/api/users/me'),
            fetchAll('/api/regions'),
        ])
        .then(([{ data }, regions]) => {
            this.setState({
                email: data.email,
                firstName: data.first_name,
                lastName: data.last_name,
                regionId: data.region,
                regions,
            })
        })
        .catch((err) => {
            this.showToast(err.message, {type: 'error'})
        })
    }

    showToast = (message, props) => {
        toast(message, props)
    }

    openModal = (modalOptions) => {
        this.setState((state) => ({ 
            shouldShowModal: true,  
            form: {
                firstName: state.firstName,
                lastName: state.lastName,
                email: state.email,
            }
        }))
    }

    closeModal = (e) => {
        if (typeof e !== 'undefined' && typeof e.preventDefault === 'function') {
            e.preventDefault()
        }

        this.setState({ 
            form: {}, 
            shouldShowModal: false,
        })
    }

    handleOnChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        
        this.setState((state) => ({
            form: {
                ...state.form,
                [name]: value
            }
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const {
            form: {
                firstName: first_name,
                lastName: last_name,
                email,
                regionId,
            }
        } = this.state

        return fetchPatch('/api/users/me', {
            first_name,
            last_name,
            email,
            ...(regionId ? {region: +regionId} : {}),
        })
        .then(this.fetchData)
        .then(this.closeModal)
        .catch((err) => {
            this.showToast(err.message, {type: 'error'})
        })
    }

    renderModal() {
        const { 
            shouldShowModal,
            form,
            regionId,
            regions,
        } = this.state

        if (!shouldShowModal) {
            return null
        }

        return (
            <Modal
                isOpen={ shouldShowModal }
                onRequestClose={ this.closeModal }
                className="modal"
                ariaHideApp={ false }
            >
                <div className="modal-body">
                    <ToastContainer/>
                    <h2>Edit Profile</h2>
                    <form className="container container-center">
                        <input type="text" name="firstName" value={ form.firstName } placeholder="first name" onChange={ this.handleOnChange } autoComplete="off" />
                        <input type="text" name="lastName" value={ form.lastName } placeholder="last name" onChange={ this.handleOnChange } autoComplete="off"/>
                        <input type="email" name="email" value={ form.email } placeholder="email" onChange={ this.handleOnChange } autoComplete="off" />
                        {
                            regions && regions.length ? (
                                <select name='regionId' value={form.regionId} onChange={this.handleOnChange} > 
                                  {regions.map(region => <option key={region.id} value={region.id}>{region.description}</option> )}
                                </select>
                            ) : null
                        }
                        <div>
                            <button className="button" onClick={ this.handleSubmit }>Save</button>
                            <button className="button" onClick={ this.closeModal }>Close</button>
                        </div>
                    </form>
                </div>
            </Modal>
        )
    }


    render() {
        const {
            shouldShowModal,
            firstName,
            lastName,
            email,
            regionId,
            regions,
        } = this.state

        let regionDescription
        try {
            regionDescription = regions.find(({id}) => regionId === id).description
        } catch (err) {
            regionDescription = 'none'
        }

        return (
            <React.Fragment>
                {!shouldShowModal ? <ToastContainer/> : null}
                <div className="container-center">
                    <Header 
                      title="Profile"
                      subtitle="Welcome to your user profile"
                    />
                    <div className="profile-container">
                        <div>
                            <div className="padding-container-field">
                                <div className="profile-container-label">Name: </div>
                                <span className="profile-container-value">{firstName} {lastName}</span>
                            </div>
                            <div className="padding-container-field">
                                <div className="profile-container-label">Email: </div>
                                <span className="profile-container-value">{email}</span>
                            </div>
                            <div className="padding-container-field">
                                <div className="profile-container-label">Region:</div>
                                <span className="profile-container-value">{regionDescription}</span>
                            </div>
                        </div>
                    </div>
                    <button className="button" onClick={this.openModal}>Edit</button>
                </div>
                { this.renderModal() }
            </React.Fragment>
        )
    }
}

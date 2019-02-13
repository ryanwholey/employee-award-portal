import React from 'react'
import PropTypes from 'prop-types'
import Cookies from 'universal-cookie'
import { fetchGet, fetchPost } from '../utils/http'

import './home.css'

export default class Home extends React.Component {

    static propTypes = {
        passedProp: PropTypes.string.isRequired
    }

    cookies = new Cookies()

    state = {
        isButtonOn: false,
        data: null,
        errors: [],
        postStatus: 'not yet posted',
        email: '',
        password: '',
        secretData: '',
        token: ''
    }

    componentDidMount() {
        fetchGet('/api/system/data')
        .then((res) => {
            this.setState({
                data: res.data
            })
        })
        .catch(() => {
            this.setState((state) => {
                return {
                    errors: [...state.errors, 'ERROR_FETCHING_DATA']
                }
            })
        })
    }

    _handleButtonClick = () => {
        this.setState((state) => {
            return {
                isButtonOn: !state.isButtonOn
            }
        })
    }

    _handlePost = () => {
        fetchPost('/api/system/post', { foo: 'bar'})
        .then(() => {
            this.setState({
                postStatus: 'SUCCESS'
            })
        })
        .catch((e) => {
            this.setState({
                postStatus: 'FAILURE'
            })
        })
    }

    _renderData() {
        const {
            data,
            errors
        } = this.state

        if (errors.includes('ERROR_FETCHING_DATA')) {
            return <div>Error fetching data</div>
        } else if (data === null || data === undefined) {
            return <div>Loading...</div>
        } else if (data === []) {
            return <div>Empty</div>
        }

        return data.map((item, index) => <div key={ index }>{ item }</div>)
    }

    _handleFormChange = (type) => (e) => {
        this.setState({
            [type]: e.target.value
        })
    }

    _handleSubmit = (e) => {
        e.preventDefault()

        const {
            email,
            password,
        } = this.state

        fetchPost('/api/login_tokens', { email, password })
        .then((res) => {
            this.cookies.set('eap-token', res.token, { path: '/' })
            window.location = '/'
        })
        .catch((e) => {
            console.error(e.message)
        })
    }

    _getSecretData = (e) => {
        e.preventDefault()

        fetchGet('/api/system/secret')
        .then((secretData) => {
            this.setState({ secretData })
        })
        .catch(() => {
            this.setState({
                secretData: 'NOPE'
            })
        })
    }

    render() {
        const { 
            isButtonOn,
            postStatus,
            data,
            secretData,
            errors,
            email,
            password,
        } = this.state

        const buttonText = isButtonOn ? 'Button is on' : 'Button is not on'

        return (
            <div className="home-container">
                <h1>Homepage</h1>
                <button onClick={ this._handleButtonClick }>{ buttonText }</button>
                <button onClick={ this._handlePost }>POST status: { postStatus }</button>
                { this._renderData() }
                <ul>
                    <li>first</li>
                    <li>second</li>
                    <li>third</li>
                </ul>
                <form >
                    <label htmlFor="email">Email</label>
                    <input id="email" value={ email } onChange={ this._handleFormChange('email') } autoComplete="off" />
                    <label htmlFor="password">Password</label>
                    <input id="password" value={ password } onChange={ this._handleFormChange('password') } autoComplete="off" />
                    <button onClick={ this._handleSubmit } type="submit">Submit </button>
                </form>
                <button onClick={ this._getSecretData }>Get Secret Data</button>
                <div>{ JSON.stringify(secretData) }</div>
            </div>
        )
    }
}

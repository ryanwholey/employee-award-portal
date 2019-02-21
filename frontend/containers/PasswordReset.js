import React from 'react';
import { fetchPost } from '../utils/http'


export default class PasswordReset extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            password: '' ,
            confirmPassword: '',
            errors: [],
        }
    }

    _assertPasswordsOk() {
        const {
            password,
            confirmPassword
        } = this.state

        console.log(password !== confirmPassword)
        console.log(password, confirmPassword)
        let hasError = false
        
        if (password !== confirmPassword) {
            hasError = true
            this.setState(({ errors }) => {
                errors: [...errors, { field: 'password', message: 'Passwords do not match' }]
            })
        }

        return hasError
    }

    _handleSumbmit = (e) => {
        e.preventDefault()
        if (this._assertPasswordsOk()) {
            return
        }

        const urlParams = window.location.search.replace('?', '').split('&')
        .reduce((memo, item) => {
            const [ key, value ] = item.split('=')
            return {
                ...memo,
                [ key ]: value,
            }
        }, {})

        const {
            password,
        } = this.state

        const httpParams = {
            ...urlParams,
            password,
        }
        fetchPost('/api/reset_password', httpParams)
        .then(() => {
            window.location = '/'
        })
        .catch(console.error)

    }

    _setStateOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    _hasErrorsForId = (elId) => {
        const { errors } = this.state

        return errors.reduce((hasError, error) => {
            if (hasError) {
                return true
            }
            return error.field === elId
        }, false)
    }

    render() {
        const {
            password,
            confirmPassword,
        } = this.state

        return (
            <div className="container-center">
                <h1>Reset Password</h1>
                <form className="container-center">
                    <div>
                        <input 
                            style={this._hasErrorsForId('password') ? { border: '1px solid red'} : {}}
                            id="password" 
                            name="password"
                            type="password" 
                            placeholder="password"
                            autoComplete="off"
                            value={ password } 
                            onChange={ this._setStateOnChange }
                        />
                    </div>
                    <div>
                        <input 
                            style={this._hasErrorsForId('confirmPassword') ? { border: '1px solid red'} : {}}
                            id="confirmPassword" 
                            name="confirmPassword"
                            type="password"
                            placeholder="confirm password"
                            autoComplete="off"
                            value={ confirmPassword } 
                            onChange={ this._setStateOnChange }
                        />
                    </div>
                    <button className="button" type="submit" onClick={ this._handleSumbmit }>Reset Password</button>
                </form> 
            </div>
        )
    }
}
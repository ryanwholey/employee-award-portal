import React from 'react'
import { fetchPost } from '../utils/http'


export default class ForgotPassword extends React.Component {
    state = {
        email: ''
    }

    _handleOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    _handleSubmit = (e) => {
        e.preventDefault()
        const { email } = this.state

        fetchPost('/api/forgot_password', { email })
        .then(() => {
            this.props.history.push('/login')
        })
    }

    render() {
        const { email } = this.state

        return (
            <React.Fragment>
                <div>Enter your email and we will send you a link to reset your password</div>
                <input 
                    id="email"
                    autoComplete="off"
                    placeholder="Email"
                    name="email"
                    type="input"
                    value={ email }
                    onChange={ this._handleOnChange }
                />
                <button className="button" type="submit" onClick={ this._handleSubmit }>Send Email</button>
            </React.Fragment>
        )
    }
}
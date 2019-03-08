import React from 'react';
import Cookies from 'universal-cookie'
import Header from './Header';
import { fetchPost } from '../utils/http'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'


export default class Signup extends React.Component {

  state = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    errors: [],
  }
    
  cookies = new Cookies()

  _updateState = (e) => {
    this.setState({ 
      [e.target.name]: e.target.value
    })
  }

  _handleSubmit = (e) => {
    e.preventDefault()

    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
    } = this.state

    if (password !== confirmPassword) {
      console.error('Passwords do not match')
      return
    }

    fetchPost('/api/users', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    })
    .then(() => {
      return fetchPost('/api/login_tokens', {
        email,
        password,
      })
    })
    .then((res) => {
      this.cookies.set('eap-token', res.token, { path: '/' })
      this.props.history.push('/')
    })
    .catch((err) => {
        this.showToast(err.message, {type: 'error'})
    })
  }

  showToast(message, props) {
    toast(message, props)
  }

  render() {
    const title = 'Employee Award Portal'
    const subtitle = 'New User Signup';
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
    } = this.state

    return (
      <div className="container-center">
        <Header 
          subtitle={subtitle}
          title={title}
        />
        <form className="container-center">
          <input 
            type='text'
            name='email'
            placeholder='Email'
            value={ email } 
            onChange={this._updateState} 
            autoComplete="off" 
          />
          <input 
            type='password'
            name='password'
            placeholder='Password'
            value={ password }
            onChange={ this._updateState }
            autoComplete="off" 
          />
          <input 
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
            value={ confirmPassword }
            onChange={ this._updateState }
            autoComplete="off" 
          />
          <input 
            type='text'
            name='firstName'
            placeholder='First Name'
            value={ firstName }
            onChange={ this._updateState }
            autoComplete="off" 
          />
          <input 
            type='text'
            name='lastName'
            placeholder='Last Name'
            value={ lastName }
            onChange={ this._updateState }
            autoComplete="off" 
          />
          <button className="button" type="submit" onClick={ this._handleSubmit }>Create</button>
        </form>
        <Link to="/login">Login</Link>
        <Link to="/forgot_password">Forgot Password</Link>
        <ToastContainer />
      </div>
    );
  }
}
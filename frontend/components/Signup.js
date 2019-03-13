import React from 'react';
import Cookies from 'universal-cookie'
import Header from './Header';
import { fetchAll, fetchPost } from '../utils/http'
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
    isFetching: true,
    regions: null,
    regionId: null,
  }
    
  cookies = new Cookies()

  componentDidMount() {
    this.fetchData()
  }

  _updateState = (e) => {
    this.setState({ 
      [e.target.name]: e.target.value
    })
  }

  fetchData = () => {
    this.setState({
      isFetching: true,
    }, () => {
      fetchAll('/api/regions')
      .then((regions) => {
        this.setState({
          regions,
          isFetching: false,
          regionId: regions[0] ? regions[0].id : '',
        })
      })
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
      regionId,
    } = this.state

    if (password !== confirmPassword) {
      this.showToast('Passwords do not match', {type: 'error'})
      return
    }

    let region
    if (regionId === '' || regionId === 0) {
      region = null
    } else {
      region = +regionId 
    }
    console.log({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      region,
    })
    fetchPost('/api/users', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      region,
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
      isFetching,
      firstName,
      lastName,
      regions,
      regionId,
    } = this.state

    if (isFetching) {
      return <span>Loading...</span>
    }

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
          <select name='regionId' value={regionId} onChange={this._updateState} > 
            {regions.map(region => <option key={region.id} value={region.id}>{region.description}</option> )}
          </select>
          <button className="button" type="submit" onClick={ this._handleSubmit }>Create</button>
        </form>
        <Link to="/login">Login</Link>
        <Link to="/forgot_password">Forgot Password</Link>
        <ToastContainer />
      </div>
    );
  }
}
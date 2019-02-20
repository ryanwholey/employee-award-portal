import React from 'react';
import Cookies from 'universal-cookie'
import { fetchPost } from '../utils/http'


export default class Credentials extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    }

    this.updateState = this.updateState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.cookies = new Cookies()
  }

  handleSubmit(e) {
    e.preventDefault();

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

  updateState(e) {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div>
        <form className="container-center" onSubmit={this.handleSubmit}>
          <input type='text' name='email' placeholder='Email' value={this.state.email} onChange={this.updateState} autoComplete="off" />
          <input type='password' name='password' placeholder='Password' value={this.state.password} onChange={this.updateState} autoComplete="off" />
          <button className='button'>Login</button>
        </form>
      </div>
    );
  }
}
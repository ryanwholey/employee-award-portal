import React from 'react';
import Header from './Header';
import Credentials from './Credentials';
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default class Login extends React.Component {

  _handleForgotPasswordClick = () => {
    this.props.history.push('/forgot_password')
  }

  _handleSignupClick = () => {
    this.props.history.push('/signup')
  }

  render() {
    const title = 'Welcome'
    const subtitle = 'Employee Awards Portal';
    
    return (
      <div className='container-center'>
        <Header 
          subtitle={subtitle}
          title={title}
        />
        <Credentials />
        <Link to="/signup">New User</Link>
        <Link to="/forgot_password">Forgot Password</Link>
        <ToastContainer />
      </div>
    );
  }
}
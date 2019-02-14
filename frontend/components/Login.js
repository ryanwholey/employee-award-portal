import React from 'react';
import Header from './Header';
import Credentials from './Credentials';


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
      <div className='container'>
        <Header 
          subtitle={subtitle}
          title={title}
        />
        <Credentials />
        <button onClick={this._handleSignupClick }>New User</button>
        <button onClick={this._handleForgotPasswordClick }>Forgot Password</button>
      </div>
    );
  }
}
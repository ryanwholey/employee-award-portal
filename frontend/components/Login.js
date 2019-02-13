import React from 'react';
import Header from './Header';
import Credentials from './Credentials';

import { Redirect } from 'react-router-dom'

export default class Login extends React.Component {

  _handleOnClick = () => {
    this.props.history.push('/forgot_password')
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
        <button onClick={this._handleOnClick }>Forgot Password</button>
      </div>
    );
  }
}
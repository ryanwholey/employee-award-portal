import React from 'react';
import Header from './Header';
import Credentials from './Credentials';

export default class Login extends React.Component {

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
      </div>
    );
  }
}
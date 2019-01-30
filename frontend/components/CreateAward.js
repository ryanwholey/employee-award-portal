import React from 'react';
import NewAward from './NewAward';
import Header from './Header';

export default class CreateAward extends React.Component {

  render() {
    const subtitle = 'Welcome back, UserName!';
    
    return (
      <div>
        <Header subtitle={subtitle} />
        <NewAward />
      </div>
    );
  }
}
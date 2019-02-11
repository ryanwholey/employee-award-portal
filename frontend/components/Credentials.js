import React from 'react';

export default class Credentials extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    }

    this.baseState = this.state;
    this.updateState = this.updateState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(`User entered the following - Email: ${this.state.email}  Pass: ${this.state.password}`);
    this.setState(this.baseState);
  }

  updateState(e) {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type='text' name='email' placeholder='Email' value={this.state.email} onChange={this.updateState} />
          <input type='password' name='password' placeholder='Password' value={this.state.password} onChange={this.updateState} />
          <button className='button'>Login</button>
        </form>
      </div>
    );
  }
}
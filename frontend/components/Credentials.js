import React from 'react';

export default class Credentials extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: undefined,
      password: undefined
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e) {
    const target = e.target;
    const name = target.name; 

    this.setState({
      [name]: value, 
    });
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type='text' name='Email' placeholder='Email' />
          <input type='password' name='Password' placeholder='Password' />
          <button 
            onClick={this.handleInputChange}
          >
            Login
          </button>
        </form>
      </div>
    );
  }
}
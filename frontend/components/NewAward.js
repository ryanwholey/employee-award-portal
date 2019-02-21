import React from 'react';
import moment from 'moment';
import uuid from 'uuid';

export default class NewAward extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      key: undefined,
      awardType: 'Employee of the Month',
      name: '',
      email: '',
      message: '',
      createdAt: '',
      error: undefined
    }
    this.baseState = this.state;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateState = this.updateState.bind(this);
  };


  handleSubmit(e) {
    e.preventDefault();
    const now = moment().format('MMM Do YYYY h:mm a');
    const newAward = {
      id: uuid(),
      name: this.state.name,
      awardType: this.state.awardType,
      email: this.state.email,
      message: this.state.message,
      createdAt: now
    };

    this.props.handleAddAward(newAward);
    this.setState(this.baseState);
  }

  updateState(e) {
    this.setState({ [e.target.name]: e.target.value });
  }


  render() {
    return (
      <div>
        <div className='new-award'>
          <h2 className='new-award__subtitle'>Create New Award</h2>
          {this.state.error && <p>{this.state.error}</p>}
          <form onSubmit={this.handleSubmit}>
            <select name='awardType' value={this.state.awardType} onChange={this.updateState} > 
              <option value={this.props.awardOptions[0]}>Employee of the Month</option>
              <option value={this.props.awardOptions[1]}>Monthly Sales Winner</option>
            </select>       
            <input type='text' required={true} name='name' placeholder='Name' value={this.state.name} onChange={this.updateState} />
            <input type='email' required={true} name='email' placeholder='Email' value={this.state.email} onChange={this.updateState} />
            <input type='text' name='message' placeholder='Message' value={this.state.message} onChange={this.updateState}/>
            <button className='button'>
              Submit
            </button>
          </form>
        </div>
      </div>
      
    )
  }
}
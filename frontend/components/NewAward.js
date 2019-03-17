import React from 'react';
import Datetime from 'react-datetime'
import moment from 'moment'

export default class NewAward extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      key: undefined,
      awardType: props.awardTypes[0].id,
      recipientId: props.users[0].id,
      error: undefined,
      granted: new Date()
    }

    this.baseState = {
      awardType: props.awardTypes[0].id,
      recipientId: props.users[0].id,
      granted: new Date(),
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      creator,
    } = this.props

    const {
      recipientId,
      awardType,
      message,
      granted,
    } = this.state
    
    const newAward = {
      creatorId: creator.id,
      recipientId: +recipientId,
      awardType: +awardType,
      granted,
    }
    
    this.props.handleAddAward(newAward)
    this.setState(this.baseState)
  }

  updateState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleDateChange = (momentDate) => {
    this.setState({granted: momentDate.toDate()})
  }

  render() {
    const {
      awardTypes,
      users,
    } = this.props
    const {
      awardType,
      error,
      recipientId,
      granted,
    } = this.state
    
    return (
      <div>
        <div className='new-award'>
          <h2 className='new-award__subtitle'>Create New Award</h2>
          {error && <p>{error}</p>}
          <form onSubmit={ this.handleSubmit }>
            <select name='awardType' value={awardType} onChange={ this.updateState } > 
              {awardTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option> )}
            </select>
            <select name='recipientId' value={recipientId} onChange={this.updateState} > 
              {users.map(user => <option key={user.id} value={user.id}>{user.email} - {user.first_name} {user.last_name}</option> )}
            </select>
            <Datetime defaultValue={granted} onChange={this.handleDateChange}/>
            <button className='button'>
              Submit
            </button>
          </form>
        </div>
      </div>
      
    )
  }
}
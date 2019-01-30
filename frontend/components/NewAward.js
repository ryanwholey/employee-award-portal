import React from 'react';

export default class NewAward extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      awardType: '',
      message: '',
      error: undefined, 
      hasSubmitted: false,
      awardOptions: ['Employee of the Month',
                     'Monthly Sales Winner']
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleInputChange(e) {
    const target = e.target;
    const name = target.name; 

    this.setState({
      [name]: value, 
      hasSubmitted: true
    });

    //console.log(this.state);
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <p>Create New Award</p>
        {this.state.error && <p>{this.state.error}</p>}
        <form onSubmit={this.handleSubmit}>
          <select name='AwardType'> 
            <option value={this.state.awardType[0]}>Employee of the Month</option>
            <option value={this.state.awardType[1]}>Monthly Sales Winner</option>
          </select>       
          <input type='text' name='Name' placeholder='Name' />
          <input type='text' name='Email' placeholder='Email' />
          <input type='text' name='Message' placeholder='Message' />
          <button 
            disabled={this.hasSubmitted} 
            //onClick={this.handleInputChange}
          >
            Submit
          </button>
        </form>
      </div>
    )
  }
}
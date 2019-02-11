import React from 'react';
import NewAward from './NewAward';
import Header from './Header';
import AwardList from './AwardList';


export default class CreateAward extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // awards: [{
      //   name: 'User1',
      //   awardType: 'Employee of the Month',
      //   email: 'sample@gmail.com',
      //   message: '',
      //   createdAt: '1' 
      // }, {
      //   name: 'User2',
      //   awardType: 'Monthly Sales Winner',
      //   email: 'sample2@gmail.com',
      //   message: '',
      //   createdAt: '2'
      // }],
      awards: [],
      awardOptions: ['Employee of the Month',
                     'Monthly Sales Winner']
    };

    this.handleAddAward = this.handleAddAward.bind(this);
    this.handleDeleteAward = this.handleDeleteAward.bind(this);
  };

  handleAddAward(award) {
    const newAward = {
      id: award.id,
      name: award.name,
      awardType: award.awardType,
      email: award.email,
      message: award.message,
      createdAt: award.createdAt
    };

    this.setState((prevState) => ({ awards: prevState.awards.concat(newAward) }));
  };

  handleDeleteAward(awardToRemove) {
    this.setState((prevState) => ({
      awards: prevState.awards.filter((award) => awardToRemove !== award.id)
    }));
  };
  
  render() {
    const subtitle = 'Welcome back, UserName!';

    return (
      <div>
        <Header subtitle={subtitle} />
        <div className='container'>
          <NewAward 
            awardOptions={this.state.awardOptions}
            handleAddAward={this.handleAddAward}
          />
          <AwardList awards={this.state.awards} handleDeleteAward={this.handleDeleteAward} />
        </div>
      </div>
    );
  }
}